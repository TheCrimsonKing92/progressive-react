// React dependencies
import React, { Component } from 'react';
import {Grid, Row, Col, NavItem} from 'react-bootstrap'
// Misc dependencies
import abbreviate from 'number-abbreviate'
// Constants
import Constants from './Constants'
// Components
import ButtonPanel from './ButtonPanel'
import ClassPicker from './ClassPicker'
import GameNav from './GameNav'
import StatsPanel from './StatsPanel'
import StorePanel from './StorePanel'
import Store from './Store'
// CSS
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.abbreviator = new abbreviate(Constants.ABBREVIATIONS)

    this.state = this.getGame();

    this.buttonClicked = this.buttonClicked.bind(this)
    this.cheat = this.cheat.bind(this)
    window.cheat = this.cheat
    this.consume = this.consume.bind(this)
    this.dumpClicked = this.dumpClicked.bind(this)
    this.handleExportSave = this.handleExportSave.bind(this)
    this.handleImportSave = this.handleImportSave.bind(this)
    this.handleStorePurchase = this.handleStorePurchase.bind(this)
    this.newGame = this.newGame.bind(this)
    this.onClassClick = this.onClassClick.bind(this)
    this.preReqFulfilled = this.preReqFulfilled.bind(this)
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
  calculateClickScore() {
    let base = 1

    if (this.upgradePurchased('Helping Hand')) {
      base += Constants.POWER.HELPING_HAND
    }

    if (this.upgradePurchased('Helping Handsier')) {
      base += Constants.POWER.HELPING_HANDSIER
    }

    if (this.upgradePurchased('Helping Handsiest')) {
      base += Constants.POWER.HELPING_HANDSIEST
    }
    
    if (this.towerPurchased('Click Tower')) {
      base += this.state.stats.clicks * Constants.CLICK_TOWER.CLICK_RATE
      base += this.getClickTowerBonus()
    }

    if (this.upgradePurchased('Click Efficiency')) {
      base *= 2
    }

    return base
  }
  calculateScore(helper, store = this.state.store, stats = this.state.stats) {
    if (helper.purchased === 0) return 0

    const getHelper = name => this.getHelper(name, store)
    const getSpecial = name => this.getSpecial(name, store)
    const isClass = name => this.isClass(name, stats)
    const towerPurchased = name => this.towerPurchased(name, store)
    const upgradePurchased = name => this.upgradePurchased(name, store)
    const magic = { 
      awakening: stats.awakening, 
      efficientOperations: stats.efficientOperations,
      isHalfToxic: (stats.toxicity >= (stats.toxicityLimit * 0.5)),
      isToxic: (stats.toxicity >= stats.toxicityLimit)
    }

    return helper.formula(getHelper, getSpecial, isClass, towerPurchased, upgradePurchased, magic)
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
  componentDidMount() {
    this.autoSave = window.setInterval(this.saveGame, 5000)
    this.gameTick = window.setInterval(this.tick, 1000)
  }
  componentWillUnmount() {
    window.clearInterval(this.autoSave)
    window.clearInterval(this.gameTick)
  }
  consume(stats = this.state.stats, store = this.state.store) {
    const consumers = this.getHelper('Consumer', store).purchased
    
    let [greenBuilt, blueBuilt] = this.getBlockFragmentsBuilt(consumers, stats, store)

    let [blueBlockFragments, blueBlocks, greenBlockFragments, greenBlocks] = this.getBlockStatuses(greenBuilt, blueBuilt, this.isClass(Constants.CLASSES.BUILDER, stats))

    this.setState({
      stats: {
        ...stats,
        blocks: {
          blue: stats.blocks.blue + blueBlocks,
          blueFragments: blueBlockFragments,
          green: stats.blocks.green + greenBlocks,
          greenFragments: greenBlockFragments
        }
      }
    })
  }
  consumeOffline(seconds, store, stats) {
    const consumers = this.getHelper('Consumer', store).purchased
    let totalGreen = 0
    let totalBlue = 0

    for (let i = 0; i < seconds; i++) {
      let greenBuilt, blueBuilt
      [greenBuilt, blueBuilt] = this.getBlockFragmentsBuilt(consumers, stats, store)
      totalGreen += greenBuilt
      totalBlue += blueBuilt
    }

    let [blueBlocks, greenBlocks] = this.getBlockStatusesOffline(totalGreen, totalBlue, this.isClass(Constants.CLASSES.BUILDER, stats))

    return [greenBlocks, blueBlocks]
  }
  consumePreReqs(stats = this.state.stats, store = this.state.store) {
    const consumers = this.getHelper('Consumer', store)

    if (consumers.purchased < 1) return false

    const decrease = this.getToxicityDecrease(stats, store)
    const increase = this.getToxicityIncrease(store)
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
    this.setState({
      stats:{
        ...this.state.stats,
        toxicity: Math.max(this.state.stats.toxicity - Constants.DUMP_POWER, 0)
      }
    })
  }
  efficientOperations() {
    let counter = 0
    const times = Math.min(this.getHelper('Robot').purchased, this.getHelper('Cloner').purchased)
    for (let i = 0; i < times; i++) {
      if (Math.random() > Constants.EFFICIENT_OPERATIONS_FAILURE_RATE) {
        counter++
      }
    }

    if (counter > 0) {
      this.setState({
        stats: {
          ...this.state.stats,
          efficientOperations: this.state.stats.efficientOperations + counter
        }
      })
    }
  }
  evaluateBuyable(buyable, stats = this.state.stats, store = this.state.store) {
    if (!buyable.multiple && buyable.purchased > 0) return false
    if (buyable.preReqs === null) return true

    return this.preReqsFulfilled(buyable.preReqs, stats, store)
  }
  getBlockFragmentsBuilt(consumers, stats = this.state.stats, store = this.state.store) {
    let blueBuilt = 0
    let greenBuilt = 0
    let bonus = this.getSpecial('Better Building', store).purchased

    while (consumers > 0) {
      const blue = (Math.random() > Constants.BLOCK_GENERATION_BLUE_RATE)
      if (Math.random() > Constants.BLOCK_GENERATION_FAILURE_RATE) {
        if (blue) {
          if (this.isClass(Constants.CLASSES.BUILDER, stats)) {
            blueBuilt += (2 + bonus)          
          } else {
            blueBuilt += (1 + bonus)
          }
        } else {
          if (this.isClass(Constants.CLASSES.BUILDER, stats)) {
            greenBuilt += (2 + bonus)
          } else {
            greenBuilt += (1 + bonus)
          }
        }
      }
      consumers--
    }

    return [greenBuilt, blueBuilt]
  }
  getBlockStatuses(greenBuilt, blueBuilt, builder) {
    let green = 0
    let greenTotal = greenBuilt + this.state.stats.blocks.greenFragments
    let blue = 0
    let blueTotal = blueBuilt + this.state.stats.blocks.blueFragments

    const limit = builder ? Constants.BLOCK_FRAGMENT_LIMIT_BUILDER : Constants.BLOCK_FRAGMENT_LIMIT

    while (greenTotal > limit) {
      greenTotal -= limit
      green++
    }

    while (blueTotal > limit) {
      blueTotal -= limit
      blue++
    }

    return [blueTotal, blue, greenTotal, green]
  }
  getBlockStatusesOffline(greenBuilt, blueBuilt, builder) {
    let green = 0
    let greenTotal = greenBuilt
    let blue = 0
    let blueTotal = blueBuilt

    const limit = builder ? Constants.BLOCK_FRAGMENT_LIMIT_BUILDER : Constants.BLOCK_FRAGMENT_LIMIT

    while (greenTotal > limit) {
      greenTotal -= limit
      green++
    }

    while (blueTotal > limit) {
      blueTotal -= limit
      blue++
    }

    return [blue, green]
  }
  getClickTowerBonus() {
    return this.getPositiveHelperOutput() * Constants.CLICK_TOWER.HELPER_RATE
  }
  getConsumption(store = this.state.store, stats = this.state.stats) {
    return this.calculateScore(this.getHelper('Consumer', store), store, stats)
  }
  getDefaultGameState() {
    return {
      options: this.getDefaultOptions(),
      stats: this.getDefaultStats(),
      store: this.getDefaultStore(),
    }
  }
  getDefaultOptions() {
    return {
      autosaveFrequency: 5,
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
  getGame() {
    const stored = localStorage.getItem(Constants.LOCALSTORAGE_ITEM_NAME)

    if (stored != null && stored.length > 0) {
      return this.unmapGameState(stored);
    } else {
      return this.getDefaultGameState();
    }
  }
  getHelper(helper, store = this.state.store) {
    return store.helpers[helper]
  }
  getOfflineProgress(seconds, store, stats) {
    return [this.getScorePerSecond(store, stats) * seconds, this.consumeOffline(seconds, store, stats)]
  }
  getPositiveHelperOutput(store = this.state.store, stats = this.state.stats) {
    return Object.values(store.helpers)
                 .filter(h => h.name !== 'Consumer')
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
    const currency = buyable.currency !== 'score' ? buyable.currency.replace('-',' ').concat('s') : buyable.currency
    const cost = this.abbreviateNumber(buyable.currentPrice)
    const costPhrase = `Costs ${cost} ${currency}`
    
    // YUCK, SPECIAL CASE HANDLING
    let description = buyable.description

    if (this.isClass(Constants.CLASSES.MECHANIC, stats)){
      if (buyable.name === 'Cybernetic Synergy') {
        description = description.replace('+14', '+28').concat(` (+100% ${Constants.CLASSES.MECHANIC.name} bonus)`)
      } else if (buyable.name === 'Efficient Operations') {
        description = description.concat(` (2x ${Constants.CLASSES.MECHANIC.name} rate)`)
      }
    }

    const title = buyable.multiple ? `${buyable.name} - ${buyable.purchased}` : buyable.name

    const base = buyable.buyable ? `${title}</br>${description}</br>${costPhrase}` : `${title}</br>${description}`

    if (buyable.type !== 'helper') return base

    const withSps = `${base}</br>${buyable.sps} score per second`

    if (buyable.name !== 'Consumer') return withSps

    const getHelper = name => this.getHelper(name, store)
    const getSpecial = name => this.getSpecial(name, store)
    const isClass = name => this.isClass(name, stats)
    const towerPurchased = name => this.towerPurchased(name, store)
    const upgradePurchased = name => this.upgradePurchased(name, store)
    const magic = { 
      awakening: stats.awakening, 
      efficientOperations: stats.efficientOperations,
      isHalfToxic: (stats.toxicity >= (stats.toxicityLimit * 0.5)),
      isToxic: (stats.toxicity >= stats.toxicityLimit)
    }

    const next = `${this.abbreviateNumber(buyable.nextFormula(getHelper, 
                                                              getSpecial, 
                                                              isClass, 
                                                              towerPurchased, 
                                                              upgradePurchased, 
                                                              magic))} score per second next`

    return `${withSps}</br>${next}`
  }
  getTower(tower, store = this.state.store) {
    return store.towers[tower]
  }
  getToxicityDecrease(stats = this.state.stats, store = this.state.store) {
    const fromHelpers = Object.values(store.helpers).filter(h => h.toxicity < 0).reduce((a, v) => a - v.toxicFormula(), 0)
    return fromHelpers + (this.isClass(Constants.CLASSES.MEDIC, stats) ? Constants.MEDIC_PASSIVE_POWER : 0)
  }
  getToxicityIncrease(store = this.state.store) {
    return this.getHelper('Consumer', store).toxicFormula(name => this.towerPurchased(name, store))
  }
  getToxicityPerSecond(stats = this.stats.stats, store = this.state.store) {
    return this.getToxicityIncrease(store) - this.getToxicityDecrease(stats, store)
  }
  getToxicityRemaining(stats = this.state.stats) {
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

    this.purchase(buyable)
  }
  helpersBought(store) {
    return Object.values(store.helpers)
                 .some(h => h.purchased > 0)
  }
  isClass(c, stats = this.state.stats) {
    return stats.selectedClass === c.name
  }
  mapBlockPurchasePrice(buyable) {
    return buyable.price + buyable.purchased
  }
  mapCurrentPrice(buyable) {
    if (buyable.type === Constants.BUYABLE_TYPE.SPECIAL) {
      if (buyable.name === 'Blue Block' || buyable.name === 'Green Block') {
        return this.mapBlockPurchasePrice(buyable)
      }
    }
    let basePrice = buyable.price
    let growth = buyable.priceGrowth

    if (buyable.currency === Constants.CURRENCY.SCORE) {
      const thief = this.isClass(Constants.CLASSES.THIEF)
      
      if (thief) {
        basePrice *= 0.9
        growth = Constants.PRICE_GROWTH.HELPER_THIEF
      }
      
      if (this.towerPurchased('Cost Tower')) {
        basePrice *= 0.9
      }
    }

    return Math.floor(basePrice * Math.pow(growth, buyable.purchased))
  }
  mapGameState(state) {
    return JSON.stringify(state)
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

    const seconds = Math.min(this.getToxicityRemaining(stats), diff)
    
    let score, greenBlocks, blueBlocks
    [score, [greenBlocks, blueBlocks]] = this.getOfflineProgress(seconds, store, stats)

    stats.score = stats.score + score
  
    let offlineMessage = `While offline for ${this.abbreviateNumber(diff)} seconds, you earned ${this.abbreviateNumber(score)} score!`

    if (blueBlocks > 0) {
      stats.blocks.blue += blueBlocks
      offlineMessage += `\nDuring that time your consumers produced ${this.abbreviateNumber(blueBlocks)} blue blocks!`
    }

    if (greenBlocks > 0) {
      stats.blocks.green += greenBlocks
      offlineMessage += `\nDuring that time your consumers produced ${this.abbreviateNumber(greenBlocks)} green blocks!`
    }

    stats.lastTime = new Date()

    alert(offlineMessage)
  }
  onClassClick(name) {
    this.setState({
      stats: {
        ...this.state.stats,
        selectedClass: name
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
      default:
        console.warn(`Unknown preReq type ${preReq.type}`)
        return false
    }
  }
  preReqsFulfilled(preReqs, stats, store) {
    return preReqs.map(p => this.preReqFulfilled(p, stats, store))
                  .every(b => b === true)
  }
  purchase(buyable) {
    const price = buyable.currentPrice
    
    let statsSplice

    if (buyable.currency === Constants.CURRENCY.SCORE) {
      if (this.state.stats.score < price) {
        return
      }

      statsSplice = {
        score: this.state.stats.score - price
      }
    } else if (buyable.currency === Constants.CURRENCY.BLOCK.BLUE) {
      if (this.state.stats.blocks.blue < price) {
        return
      }

      statsSplice = {
        blocks: {
          ...this.state.stats.blocks,
          blue: this.state.stats.blocks.blue - price
        }
      }

      // YUCK
      if (buyable.name === 'Green Block') {
        statsSplice = {
          blocks: {
            ...statsSplice.blocks,
            green: this.state.stats.blocks.green + 1
          }
        }
      } else if (buyable.name === 'Toxic Capacity') {
        statsSplice = {
          ...this.state.stats,
          blocks: statsSplice.blocks,
          toxicityLimit: this.state.stats.toxicityLimit + 5
        }
      } else if (buyable.name === 'Toxicity Recyling') {
        const max = Math.max(0, this.state.stats.toxicity - Constants.TOXICITY_RECYCLING_POWER)
        statsSplice = {
          ...this.state.stats,
          blocks: statsSplice.blocks,
          toxicity: max
        }
      }
    } else if (buyable.currency === Constants.CURRENCY.BLOCK.GREEN) {
      if (this.state.stats.blocks.green < price) {
        return
      }

      statsSplice = {
        blocks: {
          ...this.state.stats.blocks,
          green: this.state.stats.blocks.green - price
        }
      }
      
      // YUCK
      if (buyable.name === 'Blue Block') {
        statsSplice = {
          blocks: {
            ...statsSplice.blocks,
            blue: this.state.stats.blocks.blue + 1
          }
        }
      }
    } else {
      console.warn(`Unknown currency ${buyable.currency}`)
      return
    }

    const bought = {
      ...buyable,
      buyable: buyable.multiple,
      purchased: buyable.purchased + 1
    }

    const storeKey = buyable.type + 's'
    const old = this.state.store[storeKey]

    this.setState({
      stats: {
        ...this.state.stats,
        ...statsSplice
      },
      store: {
        ...this.state.store,
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
    this.offlineProgress()

    this.setState({
      stats: {
        ...this.state.stats,
        score: this.state.stats.score + this.getPositiveHelperOutput()
      },
      store: {
        ...this.state.store,
        specials: this.unlockBuyables('special'),
        towers: this.unlockBuyables('tower'),
        upgrades: this.unlockBuyables('upgrade')
      }
    })

    if (this.consumePreReqs()) {
      this.consume()
    }
    if (this.upgradePurchased('Efficient Operations')) {
      this.efficientOperations()
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
  unlockBuyables(type) {
    const copy = Object.assign({}, this.state.store[type + 's'])

    for (let prop in copy) {
      copy[prop].buyable = this.evaluateBuyable(copy[prop])
    }

    return copy
  }
  unmapGameState(mapped) {
    const previous = JSON.parse(mapped)

    const options = previous.options
    const stats = previous.stats    
    const store = previous.store

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
    
    this.offlineProgress(stats, store)

    return {
      options: options,
      stats: stats,
      store: store
    }
  }
  upgradePurchased(upgrade, store) {
    const found = this.getUpgrade(upgrade, store)

    return !found ? false : found.purchased > 0
  }
  render() {
    const options = this.state.options
    const stats = this.state.stats
    let store = this.state.store

    for (let type in store) {
      let collection = store[type]

      for (let member in collection) {
        let buyable = collection[member]

        if (buyable.type === 'helper') {
          buyable = {
            ...buyable,
            sps: this.abbreviateNumber(this.calculateScore(buyable))
          }
        }

        buyable = {
          ...buyable,
          currentPrice: this.mapCurrentPrice(buyable)
        }

        buyable = {
          ...buyable,
          tooltip: this.getTooltip(buyable, stats)
        }

        store[type][member] = buyable
      }
    }

    const autosave = options.autosaveFrequency
    const blueBlocks = this.abbreviateNumber(stats.blocks.blue)
    const clicks = this.abbreviateNumber(stats.clicks)
    const clickScore = this.abbreviateNumber(Math.floor(this.calculateClickScore()))
    const greenBlocks = this.abbreviateNumber(stats.blocks.green)
    const justClasses = Object.values(Constants.CLASSES)
    const purchaseHandling = options.purchaseHandling
    const score = this.abbreviateNumber(Math.floor(stats.score))
    const scorePerSecond = this.abbreviateNumber(this.getScorePerSecond())
    const selectedClass = stats.selectedClass
    const toxicity = stats.toxicity
    const toxicityLimit = stats.toxicityLimit
    const toxicityPerSecond = this.abbreviateNumber(this.getToxicityPerSecond(stats, store))

    const autosaveText = `Autosave Every ${autosave} Second${autosave === 1 ? '' : 's'}`
    const purchaseText = `One-Time Buyables ${purchaseHandling ? 'Fade' : 'Disappear'}`

    return (
      <div className="App">
        <Grid>
          <Row>
            <GameNav>
              <NavItem eventKey={1} href="#" onClick={this.newGame}>New Game</NavItem>
              <NavItem eventKey={2} href="#" onClick={this.saveGame}>Save Game</NavItem>
              <NavItem eventKey={3} href="#" onClick={this.handleExportSave}>Export Save</NavItem>
              <NavItem eventKey={4} href="#" onClick={this.handleImportSave}>Import Save</NavItem>
              <NavItem eventKey={5} href="#" onClick={this.toggleAutosave}>{autosaveText}</NavItem>
              <NavItem eventKey={6} href="#" onClick={this.togglePurchaseHandling}>{purchaseText}</NavItem>
            </GameNav>
          </Row>
          { this.state.stats.selectedClass !== null ? (
              <Row>
                <Col xs={12} md={3}>
                  <ButtonPanel buttonHandle={this.buttonClicked} dumpHandle={this.dumpClicked} />
                </Col>
                <Col xs={12} md={5}>
                  <StatsPanel
                    blueBlocks={blueBlocks}
                    clicks={clicks}
                    clickScore={clickScore}
                    greenBlocks={greenBlocks}
                    score={score}
                    scorePerSecond={scorePerSecond}
                    selectedClass={selectedClass}
                    toxicity={toxicity}
                    toxicityLimit={toxicityLimit}
                    toxicityPerSecond={toxicityPerSecond} />
                </Col>
                <Col xs={12} md={4}>
                  <StorePanel onPurchase={this.handleStorePurchase} purchaseHandling={purchaseHandling} store={store} />
                </Col>
              </Row>
            ) : <ClassPicker classes={justClasses} onClassClick={this.onClassClick}/>
          }
          
        </Grid>
      </div>
    );
  }
}

export default App;
