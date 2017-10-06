import React, { Component } from 'react';
import ButtonPanel from './ButtonPanel'
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
      base++
    }

    if (this.upgradePurchased('Helping Handsier')) {
      base += 4
    }

    if (this.upgradePurchased('Helping Handsiest')) {
      base += 16
    }
    
    if (this.towerPurchased('Click Tower')) {
      base += this.state.stats.clicks * Constants.CLICK_TOWER.CLICK_RATE
      base += this.getPositiveHelperOutput() * Constants.CLICK_TOWER.HELPER_RATE
    }

    if (this.upgradePurchased('Click Efficiency')) {
      base *= 2
    }

    return base
  }
  calculateScore(helper) {
    const name = helper.name
    let base = helper.power
    let total = 0
    const basic = h => h.power * h.purchased

    if (name === 'AutoClicker') {
      if (this.upgradePurchased('Helping Hand')) {
        base++
      }

      if (this.upgradePurchased('Helping Handsier')) {
        base += 4
      }

      if (this.upgradePurchased('Helping Handsiest')) {
        base += 16
      }

      total = base * helper.purchased

      if (this.upgradePurchased('Click Efficiency')) {
        total *= 2
      }

      if (this.upgradePurchased('Audible Motiviation')) {
        const audibleBase = 1.00
        const factor = .01

        total *= audibleBase + (factor * this.getHelper('Djinn').purchased)
      }
      return total
    } else if (name === 'Hammer') {
      if (this.upgradePurchased('Heavier Hammers')) {
        base *= 2
      }

      total = base * helper.purchased

      if (this.upgradePurchased('Cybernetic Synergy')) {
        const bound = Math.min(helper.purchased, this.getHelper('Robot').purchased)
        total += (5 * bound)
      }

      return total
    } else if (name === 'Robot') {
      total = base * helper.purchased

      if (this.upgradePurchased('Cybernetic Synergy')) {
        const bound = Math.min(helper.purchased, this.getHelper('Hammer').purchased)
        total += (7 * bound)
      }

      return total
    } else if (name === 'Airplane') {
      total = base * helper.purchased

      if (this.upgradePurchased('Extended Cargo')) {
        total *= 1.25
      }

      if (this.upgradePurchased('Buddy System')) {
        total *= 2
      }

      return total
    } else if (name === 'Cloner') {
      if (this.upgradePurchased('Efficient Operations')) {
        base += this.state.stats.efficientOperations
      }

      total = base * helper.purchased

      if (this.upgradePurchased('Cloner Overdrive')) {
        total *= 1.4
      }

      return total
    } else if (name === 'Djinn') {
      return basic(helper)
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
  consume() {
    const consumption = this.getConsumption(this.getPositiveHelperOutput())
    if (consumption !== 0) {
      const consumers = this.getHelper('Consumer').purchased
      let greenBuilt, blueBuilt
      [greenBuilt, blueBuilt] = this.getBlocksBuilt(consumers)

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

    return buyable.preReqs === null || this.preReqsFulfilled(buyable.preReqs, stats, store)
  }
  getBlocksBuilt(consumers) {
    let blueBuilt = 0
    let greenBuilt = 0

    while (consumers > 0) {
      const blue = (Math.random() > Constants.BLOCK_GENERATION_BLUE_RATE)
      if (Math.random() > Constants.BLOCK_GENERATION_FAILURE_RATE) {
        if (blue) {
          blueBuilt++
        } else {
          greenBuilt++
        }
      }
      consumers--
    }

    return [greenBuilt, blueBuilt]
  }
  getBlockStatuses(greenBuilt, blueBuilt) {
    let green = 0
    let greenTotal = greenBuilt + this.state.stats.blocks.greenFragments
    let blue = 0
    let blueTotal = blueBuilt + this.state.stats.blocks.blueFragments

    while (greenTotal > Constants.BLOCK_FRAGMENT_LIMIT) {
      greenTotal -= Constants.BLOCK_FRAGMENT_LIMIT
      green++
    }

    while (blueTotal > Constants.BLOCK_FRAGMENT_LIMIT) {
      blueTotal -= Constants.BLOCK_FRAGMENT_LIMIT
      blue++
    }

    return [blueTotal, blue, greenTotal, green]
  }
  getConsumption(income) {
    return this.calculateScore(this.getHelper('Consumer'))
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
      score: 0,
      toxicity: 0
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
  getPositiveHelperOutput() {
    return Object.values(this.state.store.helpers).filter(h => h.name !== 'Consumer').map(h => this.calculateScore(h)).reduce((acc, val) => acc + val, 0)
  }
  getScorePerSecond() {
    const positiveHelpers = this.getPositiveHelperOutput()
    const consumption = this.getConsumption()

    return positiveHelpers + consumption
  }
  getSpecial(special, store = this.state.store) {
    return store.specials[special]
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
  mapGameState(state) {
    return JSON.stringify(state)
  }
  newGame() {
    const state = this.getDefaultGameState()
    localStorage.setItem(Constants.LOCALSTORAGE_ITEM_NAME, this.mapGameState(state))
    this.setState(state)
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
    const price = Math.floor(buyable.price * Math.pow(buyable.priceGrowth, buyable.purchased))
    
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

        console.log(`StatsSplice: ${JSON.stringify(statsSplice)}`)
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
        score: this.state.stats.score + this.getScorePerSecond()
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
  towerPurchased(tower) {
    const found = this.getTower(tower)
    
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
  upgradePurchased(upgrade) {
    const found = this.getUpgrade(upgrade)

    return !found ? false : found.purchased > 0
  }
  render() {
    // console.log(`State: ${JSON.stringify(this.state)}`)
    const options = this.state.options
    const stats = this.state.stats
    const store = this.state.store

    const autosave = options.autosaveFrequency
    const blueBlocks = stats.blocks.blue
    const clicks = stats.clicks
    const greenBlocks = stats.blocks.green
    const score = Math.floor(stats.score).toLocaleString()
    const scorePerSecond = this.getScorePerSecond().toLocaleString()
    const toxicity = stats.toxicity
    const upgradeHandling = options.upgradeHandling

    return (
      <div className="App">
        <Grid>
          <Row>
            <GameNav>
              <NavItem eventKey={1} href="#" onClick={this.newGame}>New Game</NavItem>
              <NavItem eventKey={2} href="#" onClick={this.saveGame}>Save Game</NavItem>
              <NavItem eventKey={3} href="#" onClick={this.handleExportSave}>Export Save</NavItem>
              <NavItem eventKey={4} href="#" onClick={this.handleImportSave}>Import Save</NavItem>
              <NavItem eventKey={5} href="#" onClick={this.toggleAutosave}>Autosave Every {`${autosave} Second${autosave === 1 ? '' : 's'}`}</NavItem>
              <NavItem eventKey={6} href="#" onClick={this.toggleUpgradeHandling}>Purchased Upgrades {upgradeHandling ? 'Fade' : 'Disappear'}</NavItem>
            </GameNav>
          </Row>
          <Row>
            <Col xs={12} md={3}>
              <ButtonPanel clickHandle={this.buttonClicked} />
            </Col>
            <Col xs={12} md={5}>
              <StatsPanel
                blueBlocks={blueBlocks}
                clicks={clicks}
                greenBlocks={greenBlocks}
                score={score}
                scorePerSecond={scorePerSecond}
                toxicity={toxicity} />
            </Col>
            <Col xs={12} md={4}>
              <StorePanel onPurchase={this.handleStorePurchase} store={store} upgradeHandling={upgradeHandling}/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
