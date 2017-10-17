import React, { Component } from 'react';
import ButtonPanel from './ButtonPanel'
import ClassPicker from './ClassPicker'
import GameNav from './GameNav'
import StatsPanel from './StatsPanel'
import StorePanel from './StorePanel'
import Store from './Store'
import {Grid, Row, Col, NavItem} from 'react-bootstrap'
import logo from './logo.svg';
import './App.css';
import Constants from './Constants'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = this.getGame();

    this.buttonClicked = this.buttonClicked.bind(this)
    this.consume = this.consume.bind(this)
    this.handleExportSave = this.handleExportSave.bind(this)
    this.handleImportSave = this.handleImportSave.bind(this)
    this.handleStorePurchase = this.handleStorePurchase.bind(this)
    this.newGame = this.newGame.bind(this)
    this.onClassClick = this.onClassClick.bind(this)
    this.preReqFulfilled = this.preReqFulfilled.bind(this)
    this.saveGame = this.saveGame.bind(this)
    this.tick = this.tick.bind(this)
    this.toggleAutosave = this.toggleAutosave.bind(this)
    this.toggleUpgradeHandling = this.toggleUpgradeHandling.bind(this)
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
    const name = helper.name
    let base = helper.power
    if (this.towerPurchased('Power Tower', store)) {
      const greater = Math.max(Math.floor(base * 1.1), 1)
      base += greater
    }
    let total = 0
    const basic = h => h.power * h.purchased

    if (name === 'AutoClicker') {
      if (this.isClass(Constants.CLASSES.MASTER, stats)) {
        base++
      }
      if (this.upgradePurchased('Helping Hand', store)) {
        base++
      }

      if (this.upgradePurchased('Helping Handsier', store)) {
        base += 2
      }

      if (this.upgradePurchased('Helping Handsiest', store)) {
        base += 6
      }

      total = base * helper.purchased

      if (this.upgradePurchased('Click Efficiency', store)) {
        total *= 2
      }

      if (this.upgradePurchased('Audible Motiviation', store)) {
        const audibleBase = 1.00
        const factor = .01

        total *= audibleBase + (factor * this.getHelper('Djinn', store).purchased)
      }
      return total
    } else if (name === 'Hammer') {
      if (this.upgradePurchased('Heavier Hammers', store)) {
        base *= 2
      }

      total = base * helper.purchased

      if (this.upgradePurchased('Cybernetic Synergy', store)) {
        let power = 5
        if (this.isClass(Constants.CLASSES.MECHANIC, stats)) power *= 2
        const bound = Math.min(helper.purchased, this.getHelper('Robot', store).purchased)
        total += (power * bound)
      }

      return total
    } else if (name === 'Robot') {
      total = base * helper.purchased

      if (this.upgradePurchased('Cybernetic Synergy', store)) {
        let power = 7
        if (this.isClass(Constants.CLASSES.MECHANIC, stats)) power *= 2
        const bound = Math.min(helper.purchased, this.getHelper('Hammer', store).purchased)
        total += (power * bound)
      }

      return total
    } else if (name === 'Airplane') {
      total = base * helper.purchased

      if (this.upgradePurchased('Extended Cargo', store)) {
        total *= 1.25
      }

      if (this.upgradePurchased('Buddy System', store)) {
        total *= 2
      }

      return total
    } else if (name === 'Cloner') {
      if (this.upgradePurchased('Efficient Operations', store)) {
        base += stats.efficientOperations
      }

      total = base * helper.purchased

      if (this.upgradePurchased('Cloner Overdrive', store)) {
        total *= 1.4
      }

      return total
    } else if (name === 'Djinn') {
      total = base * helper.purchased
      
      if (this.upgradePurchased('Audible Motiviation', store)) {
        const audibleBase = 1.00
        const factor = .02

        total *= audibleBase + (factor * this.getHelper('AutoClicker', store).purchased)
      }

      return total
    } else if (name === 'Consumer') {
      return helper.purchased === 0 ? 0 : (-1 * Math.pow(2, helper.purchased - 1))
    } else {
      return 0
    }
  }
  componentDidMount() {
    this.autoSave = window.setInterval(this.saveGame, 5000)
    this.gameTick = window.setInterval(this.tick, 1000)
  }
  componentWillUnmount() {
    window.clearInterval(this.autoSave)
    window.clearInterval(this.gameTick)
  }
  consume(stats = this.state.stats) {
    const consumption = this.getConsumption()
    if (consumption !== 0) {
      const consumers = this.getHelper('Consumer').purchased

      const builder = this.isClass(Constants.CLASSES.BUILDER, stats)
      let greenBuilt, blueBuilt
      [greenBuilt, blueBuilt] = this.getBlockFragmentsBuilt(consumers, stats)

      let blueBlockFragments, blueBlocks, greenBlockFragments, greenBlocks
      [blueBlockFragments, blueBlocks, greenBlockFragments, greenBlocks] = this.getBlockStatuses(greenBuilt, blueBuilt)

      this.setState({
        stats: {
          ...this.state.stats,
          blocks: {
            blue: this.state.stats.blocks.blue + blueBlocks,
            blueFragments: blueBlockFragments,
            green: this.state.stats.blocks.green + greenBlocks,
            greenFragments: greenBlockFragments
          },
          score: this.state.stats.score + consumption
        }
      })
    }
  }
  consumeOffline(seconds, store, stats) {
    const consumers = this.getHelper('Consumer', store).purchased
    let totalGreen = 0
    let totalBlue = 0

    for (let i = 0; i < seconds; i++) {
      let greenBuilt, blueBuilt
      [greenBuilt, blueBuilt] = this.getBlockFragmentsBuilt(consumers, stats)
      totalGreen += greenBuilt
      totalBlue += blueBuilt
    }

    let blueBlockFragments, blueBlocks, greenBlockFragments, greenBlocks
    [blueBlockFragments, blueBlocks, greenBlockFragments, greenBlocks] = this.getBlockStatusesOffline(totalGreen, totalBlue, this.isClass(Constants.CLASSES.BUILDER, stats))

    return [greenBlocks, blueBlocks]
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
  getBlockFragmentsBuilt(consumers, stats = this.state.stats) {
    let blueBuilt = 0
    let greenBuilt = 0

    while (consumers > 0) {
      const blue = (Math.random() > Constants.BLOCK_GENERATION_BLUE_RATE)
      if (Math.random() > Constants.BLOCK_GENERATION_FAILURE_RATE) {
        if (blue) {
          if (this.isClass(Constants.CLASSES.BUILDER, stats)) {
            blueBuilt += 2
          } else {
            blueBuilt += 1
          }
        } else {
          if (this.isClass(Constants.CLASSES.BUILDER, stats)) {
            greenBuilt += 2
          } else {
            greenBuilt += 1
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

    return [blueTotal, blue, greenTotal, green]
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
      upgradeHandling: true
    }
  }
  getDefaultStats() {
    return {
      blocks: {
        blue: 0,
        blueFragments: 0,
        green: 0,
        greenFragments: 0
      },
      clicks: 0,
      efficientOperations: 0,
      gatheringPower: 0,
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
    return Object.values(store.helpers).filter(h => h.name !== 'Consumer').map(h => this.calculateScore(h, store, stats)).reduce((acc, val) => acc + val, 0)
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
  getTooltip(buyable, stats = this.state.stats) {
    const currency = buyable.currency !== 'score' ? buyable.currency.replace('-',' ').concat('s') : buyable.currency
    const cost = buyable.currentPrice.toLocaleString()
    const costPhrase = buyable.multiple ? `Next costs ${cost} ${currency}` : `Costs ${cost} ${currency}`
    
    // YUCK, SPECIAL CASE HANDLING
    let description = buyable.description

    if (this.isClass(Constants.CLASSES.MECHANIC, stats) && buyable.name === 'Cybernetic Synergy') {
      description = description.replace('+12', '+24').concat(` (+100% ${Constants.CLASSES.MECHANIC.name} bonus)`)
    } else if (this.isClass(Constants.CLASSES.MECHANIC, stats) && buyable.name === 'Efficient Operations') {
      description = description.concat(` (2x ${Constants.CLASSES.MECHANIC.name} rate)`)
    }

    const base = buyable.buyable ? `${buyable.name}</br>${description}</br>${costPhrase}` : `${buyable.name}</br>${description}`

    if (!buyable.multiple) return base
    if (buyable.type !== 'helper') return `${base}</br>${buyable.purchased} Purchased`

    return `${base}</br>${buyable.sps} score per second</br>${buyable.purchased} Purchased`
  }
  getTower(tower, store = this.state.store) {
    return store.towers[tower]
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
  offlineProgress(stats, store) {    
    const diff = this.getSecondsSinceLoad(stats.lastTime)
    
    if (diff < Constants.OFFLINE_PROGRESS_MINIMUM) return
    
    let score, greenBlocks, blueBlocks
    [score, [greenBlocks, blueBlocks]] = this.getOfflineProgress(diff, store, stats)

    stats.score = stats.score + score
  
    let offlineMessage = `While offline for ${diff.toLocaleString()} seconds, you earned ${score.toLocaleString()} score!`

    if (blueBlocks > 0) {
      stats.blocks.blue += blueBlocks
      offlineMessage += `\nDuring that time your consumers produced ${blueBlocks.toLocaleString()} blue blocks!`
    }

    if (greenBlocks > 0) {
      stats.blocks.green += greenBlocks
      offlineMessage += `\nDuring that time your consumers produce ${greenBlocks.toLocaleString()} green blocks!`
    }

    alert(offlineMessage)
  }
  onClassClick(name) {
    console.log(`Selected class ${name}`)
    this.setState({
      stats: {
        ...this.state.stats,
        selectedClass: name
      }
    })
  }
  preReqFulfilled(preReq, stats = this.state.stats, store = this.state.store) {
    const type = preReq.type

    if (type === Constants.PREREQ.HELPER.NUMBER) {
      return this.getHelper(preReq.target, store).purchased >= preReq.value
    } else if (type === Constants.PREREQ.HELPER.PURCHASED) {
      return this.getHelper(preReq.target, store).purchased > 0
    } else if (type === Constants.PREREQ.CLICKS.NUMBER) {
      return stats.clicks >= preReq.value
    } else if (type === Constants.PREREQ.SPECIAL.NUMBER) {
      return this.getSpecial(preReq.target, store).purchased >= preReq.value
    } else if (type === Constants.PREREQ.SPECIAL.PURCHASED) {
      return this.getSpecial(preReq.target, store).purchased > 0
    } else if (type === Constants.PREREQ.TOWER.PURCHASED) {
      return this.getTower(preReq.target, store).purchased > 0
    } else if (type === Constants.PREREQ.UPGRADE.PURCHASED) {
      return this.getUpgrade(preReq.target, store).purchased > 0
    } else {
      console.warn(`Unknown preReq type ${type}`)
      return false
    }
  }
  preReqsFulfilled(preReqs, stats, store) {
    return preReqs.map(p => this.preReqFulfilled(p, stats, store)).reduce((a, v) => a && v, true)
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

    this.consume()
    if (this.upgradePurchased('Efficient Operations')) {
      this.efficientOperations()
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
  toggleUpgradeHandling() {
    this.setState({
      options: {
        ...this.state.options,
        upgradeHandling: !this.state.options.upgradeHandling
      }
    })
  }
  towerPurchased(tower, store = this.state.store) {
    const found = this.getTower(tower, store)
    
    return !found ? false : found.purchased > 0
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

    this.offlineProgress(stats, store)

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
    // console.log(`State: ${JSON.stringify(this.state)}`)
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
            sps: this.calculateScore(buyable)
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
    const blueBlocks = stats.blocks.blue
    const clicks = stats.clicks
    const clickScore = Math.floor(this.calculateClickScore()).toLocaleString()
    const greenBlocks = stats.blocks.green
    const score = Math.floor(stats.score).toLocaleString()
    const scorePerSecond = this.getScorePerSecond().toLocaleString()
    const selectedClass = stats.selectedClass
    const toxicity = stats.toxicity
    const toxicityLimit = stats.toxicityLimit
    const upgradeHandling = options.upgradeHandling

    const autosaveText = `Autosave Every ${autosave} Second${autosave === 1 ? '' : 's'}`
    const upgradeText = `Purchased Upgrades ${upgradeHandling ? 'Fade' : 'Disappear'}`

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
              <NavItem eventKey={6} href="#" onClick={this.toggleUpgradeHandling}>{upgradeText}</NavItem>
            </GameNav>
          </Row>
          { this.state.stats.selectedClass !== null ? (
              <Row>
                <Col xs={12} md={3}>
                  <ButtonPanel clickHandle={this.buttonClicked} />
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
                    toxicityLimit={toxicityLimit} />
                </Col>
                <Col xs={12} md={4}>
                  <StorePanel onPurchase={this.handleStorePurchase} store={store} upgradeHandling={upgradeHandling}/>
                </Col>
              </Row>
            ) : <ClassPicker classes={Object.values(Constants.CLASSES)} onClassClick={this.onClassClick}/>
          }
          
        </Grid>
      </div>
    );
  }
}

export default App;
