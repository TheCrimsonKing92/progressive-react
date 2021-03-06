// React dependencies
import React, { Component } from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'
// Misc dependencies
import abbreviate from 'number-abbreviate'
import toastr from 'toastr'
// Constants
import Constants from './Constants'
// Components
import ButtonPanel from './ButtonPanel'
import ClassPicker from './ClassPicker'
import GameNav from './GameNav'
import HelpModal from './HelpModal'
import NewGameModal from './NewGameModal'
import StatsPanel from './StatsPanel'
import StorePanel from './StorePanel'
import Store from './Store'
// CSS
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    
    toastr.options.closeButton = true
    toastr.options.timeout = 30
    toastr.options.extendedTimeOut = 60
    toastr.options.progressBar = true

    this.abbreviator = new abbreviate(Constants.ABBREVIATIONS)

    this.state = this.getGame();

    this.abbreviateNumber = this.abbreviateNumber.bind(this)
    this.buttonClicked = this.buttonClicked.bind(this)
    this.cheat = this.cheat.bind(this)
    window.cheat = this.cheat
    this.closeHelpModal = this.closeHelpModal.bind(this)
    this.closeNewGameModal = this.closeNewGameModal.bind(this)
    this.consume = this.consume.bind(this)
    this.dumpClicked = this.dumpClicked.bind(this)
    this.handleExportSave = this.handleExportSave.bind(this)
    this.handleImportSave = this.handleImportSave.bind(this)
    this.handleStorePurchase = this.handleStorePurchase.bind(this)
    this.newGame = this.newGame.bind(this)
    window.newGame = this.newGame
    this.onClassClick = this.onClassClick.bind(this)
    this.openHelpModal = this.openHelpModal.bind(this)
    this.openNewGameModal = this.openNewGameModal.bind(this)
    this.preReqFulfilled = this.preReqFulfilled.bind(this)
    this.resetBlocks = this.resetBlocks.bind(this)
    window.resetBlocks = this.resetBlocks
    this.saveGame = this.saveGame.bind(this)
    this.tick = this.tick.bind(this)
    this.toggleAutosave = this.toggleAutosave.bind(this)
    this.togglePurchaseHandling = this.togglePurchaseHandling.bind(this)
  }
  abbreviateNumber(value) {
    return this.abbreviator.abbreviate(value, 2)
  }
  awakening() {
    const current = this.state.stats.awakening
    if (current >= Constants.AWAKENING_POWER_LIMIT) return

    const tick = this.state.stats.awakeningTick
    if (tick < Constants.AWAKENING_POWER_TICKS) {
      this.setState({
        stats: {
          ...this.state.stats,
          awakeningTick: tick + 1
        }
      })
      return
    }

    this.setState({
      stats: {
        ...this.state.stats,
        awakening: current + Constants.AWAKENING_POWER_GROWTH,
        awakeningTick: 0
      }
    })
  }
  buttonClicked() {
    this.setState({
      stats:{
        ...this.state.stats,
        clicks: this.state.stats.clicks + 1,
        score: this.state.stats.score + this.calculateClickScore()
      }
    })
  }
  calculateClickScore(stats = this.state.stats, store = this.state.store) {
    let base = 1

    if (this.isClass(Constants.CLASSES.MASTER, stats)) {
      base += 1
    }

    if (this.upgradePurchased('Helping Hand', store)) {
      base += Constants.POWER.HELPING_HAND
    }

    if (this.upgradePurchased('Helping Handsier', store)) {
      base += Constants.POWER.HELPING_HANDSIER
    }

    if (this.upgradePurchased('Helping Handsiest', store)) {
      base += Constants.POWER.HELPING_HANDSIEST
    }
    
    if (this.towerPurchased('Click Tower', store)) {
      base += stats.clicks * Constants.CLICK_TOWER.CLICK_RATE
      base += this.getClickTowerBonus(stats, store)
    }

    if (this.upgradePurchased('Click Efficiency', store)) {
      base *= 2
    }

    return base
  }
  calculateScore(helper, store = this.state.store, stats = this.state.stats) {
    if (helper.purchased === 0) return 0

    return helper.formula(this.getHelperFunctions(stats, store))
  }
  cheat() {
    this.setState({
      stats: {
        ...this.state.stats,
        blocks: {
          ...this.state.stats.blocks,
          blue: this.state.stats.blocks.blue * 1000000,
          green: this.state.stats.blocks.green * 1000000
        },
        score: this.state.stats.score * 1000000
      }
    })
  }
  resetBlocks() {
    this.setState({
      stats: {
        ...this.state.stats,
        blocks: {
          ...this.state.stats.blocks,
          blue: 0,
          green: 0
        }
      }
    })
  }
  checkServiceWorkerStatus() {
    if (!window.hasOwnProperty('serviceWorkerStatus') || window.serviceWorkerStatus === 0) {
      toastr.success('You have the latest version of Progressive Game!')
    } else {
      toastr.warning('Please refresh for the latest Progressive Game')
    }
  }
  closeHelpModal() {
    this.setState({
      ui: {
        ...this.state.ui,
        helpModalOpen: false
      }
    })
  }
  closeNewGameModal() {
    this.setState({
      ui: {
        ...this.state.ui,
        newGameModalOpen: false
      }
    })
  }
  componentDidMount() {
    this.autoSave = window.setInterval(this.saveGame, 5000)
    this.gameTick = window.setInterval(this.tick, 1000)
    this.checkServiceWorkerStatus()
  }
  componentWillUnmount() {
    window.clearInterval(this.autoSave)
    window.clearInterval(this.gameTick)
  }
  consume(stats = this.state.stats, store = this.state.store) {
    const consumers = this.getHelper('Consumer', store).purchased
    
    const { greenBuilt, blueBuilt } = this.getBlockFragmentsBuilt(consumers, stats, store)

    const { blueFragments, blue, greenFragments, green } = this.getBlockStatuses(greenBuilt + stats.blocks.greenFragments,
                                                                                            blueBuilt + stats.blocks.blueFragments,
                                                                                            this.isClass(Constants.CLASSES.BUILDER, stats))
               
    this.setState({
      stats: {
        ...stats,
        blocks: {
          blue: stats.blocks.blue + blue,
          blueFragments: blueFragments,
          green: stats.blocks.green + green,
          greenFragments: greenFragments
        }
      }
    })
  }
  consumeOffline(seconds, store, stats) {
    const consumers = this.getHelper('Consumer', store).purchased
    let totalGreen = 0
    let totalBlue = 0

    for (let i = 0; i < seconds; i++) {
      const { greenBuilt, blueBuilt } = this.getBlockFragmentsBuilt(consumers, stats, store)
      totalGreen += greenBuilt
      totalBlue += blueBuilt
    }

    return this.getBlockStatuses(totalGreen, totalBlue, this.isClass(Constants.CLASSES.BUILDER, stats))
  }
  consumePreReqs(stats, store) {
    const consumers = this.getHelper('Consumer', store)

    if (consumers.purchased < 1) return false

    const decrease = this.getToxicityDecrease(stats, store)
    const increase = this.getToxicityIncrease(stats, store)
    const toxicity = this.getToxicityRemaining(stats)
    
    if ((decrease + toxicity) < increase) {
      const next = Math.max((stats.toxicity - decrease), 0)
      this.setState({
        stats: {
          ...stats,
          toxicity: next
        }
      })
      return false
    }

    const cost = this.getConsumption(store, stats)

    const remainder = stats.score + cost

    if (remainder < 0) return false

    this.setState({
      stats: {
        ...stats,
        score: remainder,
        toxicity: Math.max(stats.toxicity + (increase - decrease), 0)
      }
    })

    return true
  }
  dumpClicked() {
    this.setState((previousState, props) => ({
      stats: {
        ...previousState.stats,
        toxicity: Math.max(previousState.stats.toxicity - Constants.DUMP_POWER, 0)
      }
    }))
  }
  efficientOperations(stats, store) {
    let counter = 0
    const times = Math.min(this.getHelper('Robot', store).purchased, this.getHelper('Cloner', store).purchased)
    for (let i = 0; i < times; i++) {
      if (Math.random() > Constants.EFFICIENT_OPERATIONS_FAILURE_RATE) counter++
    }

    if (counter === 0) return

    this.setState({
      stats: {
        ...stats,
        efficientOperations: stats.efficientOperations + counter
      }
    })
  }
  evaluateBuyable(buyable, stats, store) {
    if (!buyable.multiple && buyable.purchased > 0) return false
    if (buyable.preReqs === null || buyable.preReqs === undefined) return true

    return this.preReqsFulfilled(buyable.preReqs, stats, store)
  }
  getBlockFragmentsBuilt(consumers, stats, store) {
    let blueBuilt = 0
    let greenBuilt = 0
    const base = 1
    let bonus = this.getSpecial('Better Building', store).purchased
    if (this.isClass(Constants.CLASSES.BUILDER, stats)) {
      bonus += 2
    }
    const total = base + bonus

    while (consumers > 0) {
      const blue = (Math.random() > Constants.BLOCK_GENERATION_BLUE_RATE)
      if (Math.random() > Constants.BLOCK_GENERATION_FAILURE_RATE) {
        if (blue) {
          blueBuilt += total
        } else {
          greenBuilt += total
        }
      }
      consumers--
    }

    return { greenBuilt, blueBuilt }
  }
  getBlockStatuses(greenFragments, blueFragments, builder) {
    const limit = builder ? Constants.BLOCK_FRAGMENT_LIMIT_BUILDER
                          : Constants.BLOCK_FRAGMENT_LIMIT

    const green = Math.floor(greenFragments / limit)
    greenFragments = greenFragments % limit

    const blue = Math.floor(blueFragments / limit)
    blueFragments = blueFragments % limit

    return { blueFragments, blue, greenFragments, green }
  }
  getClickTowerBonus(stats, store) {
    return this.getPositiveHelperOutput(store, stats) * Constants.CLICK_TOWER.HELPER_RATE
  }
  getConsumption(store = this.state.store, stats = this.state.stats) {
    return this.calculateScore(this.getHelper('Consumer', store), store, stats)
  }
  getDefaultGameState() {
    return {
      options: this.getDefaultOptions(),
      stats: this.getDefaultStats(),
      store: this.getDefaultStore(),
      ui: this.getDefaultUi()
    }
  }
  getDefaultOptions() {
    return {
      autosaveFrequency: 5,
      intro: {
        showing: true,
        showOnLoad: true
      },
      purchaseHandling: true,
      upgradeHandling: true
    }
  }
  getDefaultStats() {
    return {
      awakening: 0,
      awakeningTick: 0,
      blocks: {
        blue: 0,
        blueFragments: 0,
        green: 0,
        greenFragments: 0
      },
      clicks: 0,
      efficientOperations: 0,
      lastTime: new Date(),
      selectedClass: null,
      score: 0,
      toxicity: 0,
      toxicityLimit: 100
    }
  }
  getDefaultStore() {
    return Store
  }
  getDefaultUi() {
    return {
      loading: false,
      helpModalOpen: false,
      newGameModalOpen: false,
      preventHelpOnNewGame: false
    }
  }
  getGame() {
    const stored = localStorage.getItem(Constants.LOCALSTORAGE_ITEM_NAME)

    if (stored != null && stored.length > 0) {
      return this.unmapGameState(stored);
    }

    return this.getDefaultGameState();
  }
  getGameDisplay(handlers, { stats, store, options, ui }) {
    if (ui.loading) {
      console.log(`loading`)
      return <FontAwesome name="refresh" spin={true} />
    }

    if (stats.selectedClass === null) {
      const justClasses = Object.values(Constants.CLASSES)        
      return <ClassPicker classes={justClasses} onClassClick={handlers.onClassClick}/>
    }

    const statsPanel = {
      blueBlocks: this.abbreviateNumber(stats.blocks.blue),
      clicks: this.abbreviateNumber(stats.clicks),
      clickScore: this.abbreviateNumber(Math.floor(this.calculateClickScore(stats, store))),
      greenBlocks: this.abbreviateNumber(stats.blocks.green),
      score: this.abbreviateNumber(Math.floor(stats.score)),
      scorePerSecond: this.abbreviateNumber(this.getScorePerSecond(store, stats)),
      selectedClass: stats.selectedClass,
      toxicity: this.getToxicityPercentage(stats, store),
      toxicityPerSecond: this.getToxicityPerSecondPercentage(stats, store) + '%'
    }
  
    const purchaseHandling = options.purchaseHandling
    return (
      <Row>
        <Col xs={12} md={3}>
          <ButtonPanel buttonHandle={handlers.buttonClicked} dumpHandle={handlers.dumpClicked} />
        </Col>
        <Col xs={12} md={5}>
          <StatsPanel {...statsPanel} />
        </Col>
        <Col xs={12} md={4}>
          <StorePanel onPurchase={handlers.handleStorePurchase} purchaseHandling={purchaseHandling} store={store} />
        </Col>
      </Row>
    )
  }
  getHelper(helper, store) {
    return store.helpers[helper]
  }  
  getHelperFunctions(stats, store) {
    const toxicity = this.getToxicityPercentage(stats, store)
    const getHelper = name => this.getHelper(name, store)
    const getSpecial = name => this.getSpecial(name, store)
    const isClass = name => this.isClass(name, stats)
    const towerPurchased = name => this.towerPurchased(name, store)
    const upgradePurchased = name => this.upgradePurchased(name, store)
    const magic = { 
      awakening: stats.awakening, 
      efficientOperations: stats.efficientOperations,
      isHalfToxic: toxicity >= 50,
      isToxic: toxicity >= 90
    }

    return { getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic }
  }
  getOfflineLimit(toxicityRemaining, toxicityPerSecond, originalSeconds) {
    if (toxicityPerSecond < 1) return [originalSeconds, false]

    return [Math.floor(toxicityRemaining / toxicityPerSecond), true]
  }
  getOfflineProgress(seconds, store, stats) {
    return {
      ...this.consumeOffline(seconds, store, stats),
      score: this.getScorePerSecond(store, stats) * seconds
    }
  }
  getPositiveHelperOutput(store, stats) {
    return Object.values(store.helpers)
                 .filter(h => h.purchased > 0 && h.name !== 'Consumer')
                 .map(h => this.calculateScore(h, store, stats))
                 .reduce((acc, val) => acc + val, 0)
  }
  getScorePerSecond(store = this.state.store, stats = this.state.stats) {
    const positiveHelpers = this.getPositiveHelperOutput(store, stats)
    const consumption = this.getConsumption(store, stats)

    return positiveHelpers + consumption
  }
  getSecondsSinceLoad(last) {
    return Math.floor(Math.abs((new Date().getTime() - new Date(last).getTime()) / 1000))
  }
  getSpecial(special, store = this.state.store) {
    return store.specials[special]
  }
  getTooltip(buyable, stats = this.state.stats, store = this.state.store) {
    if (buyable.type === Constants.BUYABLE_TYPE.HELPER || buyable.type === Constants.BUYABLE_TYPE.UPGRADE || buyable.type === Constants.BUYABLE_TYPE.TOWER ||
        buyable.type === Constants.BUYABLE_TYPE.SPECIAL) {      
      return buyable.getTooltip(this.abbreviateNumber, this.getHelperFunctions(stats, store))
    }
    
    console.warn(`Unknown buyable type ${buyable.type}. Name? ${buyable.name}`)
  }
  getTower(tower, store = this.state.store) {
    return store.towers[tower]
  }
  getToxicityDecrease(stats, store) {
    const helperFunctions = this.getHelperFunctions(stats, store)
    const fromHelpers = Object.values(store.helpers)
                              .filter(h => h.toxicity < 0)
                              .map(helper => helper.toxicFormula(helperFunctions))
                              .reduce((a, v) => a - v, 0)
    return fromHelpers + (helperFunctions.isClass(Constants.CLASSES.MEDIC) ? Constants.MEDIC_PASSIVE_POWER : 0)
  }
  getToxicityIncrease(stats, store) {
    return this.getHelper('Consumer', store).toxicFormula(this.getHelperFunctions(stats, store))
  }
  getToxicityPerSecond(stats, store) {
    return this.getToxicityIncrease(stats, store) - this.getToxicityDecrease(stats, store)
  }
  getToxicityPerSecondPercentage(stats = this.state.stats, store = this.state.store) {
    const base = (this.getToxicityPerSecond(stats, store) * 100) / stats.toxicityLimit
    return parseFloat(base.toFixed(2))
  }
  getToxicityPercentage(stats = this.state.stats, store = this.state.store) {
    // The dumbass abbreviate-number library doesn't want to abbreviate the value when it's less than 1
    // So let's do some shitty manipulations
    const base = (stats.toxicity * 100) / stats.toxicityLimit
    return parseFloat(base.toFixed(2))
  }
  getToxicityRemaining(stats) {
    return stats.toxicityLimit - stats.toxicity
  }
  getUpgrade(upgrade, store = this.state.store) {
    return store.upgrades[upgrade]
  }
  handleExportSave() {
    window.prompt(`Copy the following string`,btoa(this.mapGameState(this.state)))
  }
  handleImportSave() {
    // const entry = window.prompt('Paste in your exported string')
    // TODO implement
  }
  handleStorePurchase(buyable) {
    if (!buyable.buyable || (!buyable.multiple && buyable.purchased > 0)) return

    const { stats, store } = this.state
    this.purchase(buyable, stats, store)
  }
  helpersBought(store) {
    return Object.values(store.helpers)
                 .some(h => h.purchased > 0)
  }
  isClass(c, stats) {
    return stats.selectedClass === c.name
  }
  mapBlockPurchasePrice(buyable) {
    return buyable.price + buyable.purchased
  }
  mapCurrentPrice(buyable, isThief) {
    if (buyable.type === Constants.BUYABLE_TYPE.SPECIAL) {
      if (buyable.name === 'Blue Block' || buyable.name === 'Green Block') {
        return this.mapBlockPurchasePrice(buyable)
      }
    }
    let basePrice = buyable.price
    let growth = buyable.priceGrowth

    if (buyable.currency === Constants.CURRENCY.SCORE) {      
      if (isThief) {
        basePrice *= 0.9
        growth = Constants.PRICE_GROWTH.HELPER_THIEF
      }

      if (buyable.name === 'Robot' && this.upgradePurchased('Plastic Bodies')) {
        basePrice *= 0.85
      } else if (buyable.name === 'Robot' && this.upgradePurchased('Steel Bodies')) {
        basePrice *= 1.05
      }

      if (buyable.name === 'Airplane' && this.upgradePurchased('Mass Production')) {
        basePrice *= 0.9
      }
      
      if (this.towerPurchased('Cost Tower')) {
        basePrice *= 0.9
      }
    }

    return Math.floor(basePrice * Math.pow(growth, buyable.purchased))
  }
  mapGameState(state) {
    return JSON.stringify({
      ...state,
      ui: this.getDefaultUi()
    })
  }
  newGame() {
    const state = this.getDefaultGameState()
    localStorage.setItem(Constants.LOCALSTORAGE_ITEM_NAME, this.mapGameState(state))
    this.setState(state)
  }
  offlineProgress(stats = this.state.stats, store = this.state.store) {
    if (stats.selectedClass === null) return
    if (!this.helpersBought(store)) return
    const diff = this.getSecondsSinceLoad(stats.lastTime)

    if (diff < Constants.OFFLINE_PROGRESS_MINIMUM) return

    const [seconds, toxic] = this.getOfflineLimit(this.getToxicityRemaining(stats), this.getToxicityPerSecond(stats, store), diff)

    if (toxic) stats.toxicity = stats.toxicityLimit
    
    const { score, blueFragments, blueBlocks, greenFragments, greenBlocks } = this.getOfflineProgress(seconds, store, stats)

    stats.score += score
  
    let offlineMessage = `While offline for ${this.abbreviateNumber(diff)} seconds, you earned ${this.abbreviateNumber(score)} score!`

    if (blueBlocks > 0) {
      stats.blocks.blue += blueBlocks
      stats.blocks.blueFragments += blueFragments
      offlineMessage += `</br>During that time your consumers produced ${this.abbreviateNumber(blueBlocks)} blue blocks!`
    }

    if (greenBlocks > 0) {
      stats.blocks.green += greenBlocks
      stats.blocks.greenFragments += greenFragments
      offlineMessage += `</br>During that time your consumers produced ${this.abbreviateNumber(greenBlocks)} green blocks!`
    }

    stats.lastTime = new Date()

    toastr.success(offlineMessage, 'Offline Progress')
  }
  onClassClick(name) {
    this.setState({
      stats: {
        ...this.state.stats,
        selectedClass: name
      }
    })
  }
  openHelpModal() {
    this.setState({
      ui: {
        ...this.state.ui,
        helpModalOpen: true
      }
    })
  }
  openNewGameModal() {
    this.setState({
      ui: {
        ...this.state.ui,
        newGameModalOpen: true
      }
    })
  }
  preReqFulfilled(preReq, stats = this.state.stats, store = this.state.store) {
    switch (preReq.type) {
      case Constants.PREREQ.HELPER.NUMBER: return this.getHelper(preReq.target, store).purchased >= preReq.value
      case Constants.PREREQ.HELPER.PURCHASED: return this.getHelper(preReq.target, store).purchased > 0
      case Constants.PREREQ.CLICKS.NUMBER: return stats.clicks >= preReq.value
      case Constants.PREREQ.SPECIAL.NUMBER: return this.getSpecial(preReq.target, store).purchased >= preReq.value
      case Constants.PREREQ.SPECIAL.PURCHASED: return this.getSpecial(preReq.target, store).purchased > 0
      case Constants.PREREQ.TOWER.PURCHASED: return this.getTower(preReq.target, store).purchased > 0
      case Constants.PREREQ.UPGRADE.PURCHASED: return this.getUpgrade(preReq.target, store).purchased > 0
      case Constants.PREREQ.UPGRADE.UNPURCHASED: return this.getUpgrade(preReq.target, store).purchased < 1
      default:
        console.warn(`Unknown preReq type ${preReq.type}`)
        return false
    }
  }
  preReqsFulfilled(preReqs, stats, store) {
    return preReqs.map(p => this.preReqFulfilled(p, stats, store))
                  .every(b => b === true)
  }
  purchase(buyable, stats, store) {
    if (buyable.currency !== Constants.CURRENCY.SCORE && buyable.currency !== Constants.CURRENCY.BLOCK.BLUE && buyable.currency !== Constants.CURRENCY.BLOCK.GREEN) {
      console.warn('Unknown currency type: ', buyable.currency)
      return
    }

    const price = buyable.currentPrice    
    let statsSplice

    if (buyable.currency === Constants.CURRENCY.SCORE) {
      if (stats.score < price) {
        return
      }

      statsSplice = {
        score: stats.score - price
      }
    } else if (buyable.currency === Constants.CURRENCY.BLOCK.BLUE) {
      if (stats.blocks.blue < price) {
        return
      }

      statsSplice = {
        blocks: {
          ...stats.blocks,
          blue: stats.blocks.blue - price
        }
      }

      // YUCK
      if (buyable.name === 'Green Block') {
        statsSplice = {
          blocks: {
            ...statsSplice.blocks,
            green: stats.blocks.green + 1
          }
        }
      } else {
        console.warn(`No side effects defined for blue block item ${buyable.name}`)
      }
    } else if (buyable.currency === Constants.CURRENCY.BLOCK.GREEN) {
      if (stats.blocks.green < price) {
        return
      }

      statsSplice = {
        blocks: {
          ...stats.blocks,
          green: stats.blocks.green - price
        }
      }
      
      // YUCK
      if (buyable.name === 'Blue Block') {
        statsSplice = {
          blocks: {
            ...statsSplice.blocks,
            blue: stats.blocks.blue + 1
          }
        }
      } else if (buyable.name === 'Toxic Capacity') {
        statsSplice = {
          blocks: statsSplice.blocks,
          toxicityLimit: stats.toxicityLimit + 5
        }
      } else if (buyable.name === 'Toxicity Recycling') {
        const max = Math.max(0, stats.toxicity - Constants.TOXICITY_RECYCLING_POWER)
        statsSplice = {
          blocks: statsSplice.blocks,
          toxicity: max
        }
      } else {
        console.warn(`No side effects defined for green block currency item '${buyable.name}'`)
      }
    }

    const bought = {
      ...buyable,
      buyable: buyable.multiple,
      purchased: buyable.purchased + 1
    }

    const storeKey = buyable.type + 's'
    const old = store[storeKey]

    this.setState({
      stats: {
        ...stats,
        ...statsSplice
      },
      store: {
        ...store,
        [storeKey]: {
          ...old,
          [buyable.name]: bought
        }
      }
    })
  }
  saveGame() {
    localStorage.setItem(Constants.LOCALSTORAGE_ITEM_NAME, this.mapGameState(this.state))
    this.setState({
      stats: {
        ...this.state.stats,
        lastTime: new Date()
      }
    })
  }
  saveTick() {
    this.saveTicks++
    if (this.saveTicks >= this.saveTickThreshold) {
      this.saveGame()
      this.saveTicks = 0
    }
  }
  tick() {
    let { stats, store } = this.state

    this.offlineProgress(stats, store)

    this.setState((previousState, props) => ({
      stats: {
        ...previousState.stats,
        score: previousState.stats.score + this.getPositiveHelperOutput(previousState.store, previousState.stats)
      },
      store: {
        ...previousState.store,
        helpers: this.unlockBuyables('helper', previousState.stats, previousState.store),
        specials: this.unlockBuyables('special', previousState.stats, previousState.store),
        tower: this.unlockBuyables('tower', previousState.stats, previousState.store),
        upgrades: this.unlockBuyables('upgrade', previousState.stats, previousState.store)
      }
    }))

    stats = this.state.stats
    store = this.state.store

    if (this.consumePreReqs(stats, store)) {
      this.consume(stats, store)
    }
    if (this.upgradePurchased('Efficient Operations')) {
      this.efficientOperations(stats, store)
    }
    if (this.upgradePurchased('The Awakening')) {
      this.awakening()
    }
    this.saveTick()
  }
  toggleAutosave() {
    const ind = Constants.AUTOSAVE_FREQUENCIES.findIndex(f => f === this.state.options.autosaveFrequency)
    
    const next = ind === (Constants.AUTOSAVE_FREQUENCIES.length - 1) ? 0 : ind + 1

    this.setState({
      options: {
        ...this.state.options,
        autosaveFrequency: Constants.AUTOSAVE_FREQUENCIES[next]
      }
    })
  }
  towerPurchased(tower, store = this.state.store) {
    const found = this.getTower(tower, store)
    
    return !found ? false : found.purchased > 0
  }
  togglePurchaseHandling() {
    this.setState({
      options: {
        ...this.state.options,
        purchaseHandling: !this.state.options.purchaseHandling
      }
    })
  }
  unlockBuyables(type, stats, store) {
    const copy = Object.assign({}, store[type + 's'])

    for (let prop in copy) {
      copy[prop].buyable = this.evaluateBuyable(copy[prop], stats, store)
    }

    return copy
  }
  unmapGameState(mapped) {
    const previous = JSON.parse(mapped)

    const { options, stats, store } = previous
    let ui = previous.ui

    const defaultStats = this.getDefaultStats()

    for (let stat in defaultStats) {
      stats[stat] = stats.hasOwnProperty(stat) ? stats[stat] : defaultStats[stat]
    }
    const defaultStore = this.getDefaultStore()

    for (let sub in defaultStore) {
      for (let prop in defaultStore[sub]) {
        store[sub][prop] = store[sub].hasOwnProperty(prop) ? 
                            Object.assign(
                              {}, 
                              defaultStore[sub][prop], 
                              {
                                purchased: store[sub][prop].purchased
                              }) 
                              : defaultStore[sub][prop]
      }
    }

    for (let prop in store.upgrades) {
      store.upgrades[prop].buyable = this.evaluateBuyable(store.upgrades[prop], stats, store)
    }

    const defaultUi = this.getDefaultUi()

    if (typeof ui === 'undefined') {
      ui = defaultUi
    } else {
      for (let sub in defaultUi) {
        ui[sub] = ui.hasOwnProperty(sub) ? ui[sub] : defaultUi[sub]
      }
    }    
    
    return { options, stats, store, ui }
  }
  upgradePurchased(upgrade, store) {
    const found = this.getUpgrade(upgrade, store)

    return !found ? false : found.purchased > 0
  }
  render() {
    const { options, stats, ui } = this.state
    let store = this.state.store

    for (let type in store) {
      let collection = store[type]

      for (let member in collection) {
        let buyable = collection[member]

        if (buyable.type === Constants.BUYABLE_TYPE.HELPER) {
          buyable = {
            ...buyable,
            sps: this.abbreviateNumber(this.calculateScore(buyable))
          }
        }

        buyable = {
          ...buyable,
          currentPrice: this.mapCurrentPrice(buyable, this.isClass(Constants.CLASSES.THIEF, stats)),
          tooltip: this.getTooltip(buyable, stats)
        }

        store[type][member] = buyable
      }
    }

    const autosave = options.autosaveFrequency
    const autosaveText = `Autosave Every ${autosave} Second${autosave === 1 ? '' : 's'}`
    const purchaseText = `One-Time Buyables ${options.purchaseHandling ? 'Fade' : 'Disappear'}`

    const handlers = {
      buttonClicked: this.buttonClicked,
      dumpClicked: this.dumpClicked,
      handleStorePurchase: this.handleStorePurchase,
      onClassClick: this.onClassClick
    }

    const { helpModalOpen, newGameModalOpen } = ui
    const navActions = {
      autosaveText,
      purchaseText,
      openHelpModal: this.openHelpModal,
      openNewGameModal: this.openNewGameModal,
      saveGame: this.saveGame,
      handleExportSave: this.handleExportSave,
      handleImportSave: this.handleImportSave,
      toggleAutosave: this.toggleAutosave,
      togglePurchaseHandling: this.togglePurchaseHandling
    }

    return (
      <div className="App">        
        <Grid>
          <HelpModal open={helpModalOpen} onClose={this.closeHelpModal} />
          <NewGameModal open={newGameModalOpen} onClose={this.closeNewGameModal} newGame={this.newGame} />
          <Row>
            <GameNav { ...navActions } />
          </Row>
          { this.getGameDisplay(handlers, { stats, store, options, ui }) }          
        </Grid>
      </div>
    );
  }
}

export default App;
