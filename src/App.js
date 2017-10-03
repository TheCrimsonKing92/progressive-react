import React, { Component } from 'react';
import ButtonPanel from './ButtonPanel'
import GameNav from './GameNav'
import StatsPanel from './StatsPanel'
import StorePanel from './StorePanel'
import Store from './Store'
import {Grid, Row, Col} from 'react-bootstrap'
import logo from './logo.svg';
import './App.css';
import Constants from './Constants'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = this.getGame();
    this.buttonClicked = this.buttonClicked.bind(this)
    this.handleExportSave = this.handleExportSave.bind(this)
    this.handleImportSave = this.handleImportSave.bind(this)
    this.handleStorePurchase = this.handleStorePurchase.bind(this)
    this.newGame = this.newGame.bind(this)
    this.saveGame = this.saveGame.bind(this)
    this.tick = this.tick.bind(this)
    this.toggleAutosave = this.toggleAutosave.bind(this)
  }
  buttonClicked() {
    this.setState({
      stats:{
        ...this.state.stats,
        clicks: this.state.stats.clicks + 1,
        score: this.state.stats.score + 1
      }
    })
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
      return basic(helper)
    } else if (name === 'Robot') {
      return basic(helper)
    } else if (name === 'Airplane') {
      return basic(helper)
    } else if (name === 'Cloner') {
      return basic(helper)
    } else if (name === 'Djinn') {
      return basic(helper)
    } else if (name === 'Consumer') {
      return basic(helper)
    } else {
      return 0
    }
  }
  componentDidMount() {
    this.autoSave = window.setInterval(this.saveGame, 5000)
    this.interval = window.setInterval(this.tick, 1000)
  }
  componentWillUnmount() {
    window.clearInterval(this.autoSave)
    window.clearInterval(this.interval)
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
      autosaveFrequency: 5
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
  getHelper(helper) {
    return this.state.store.helpers[helper]
  }
  getScorePerSecond() {
    // TODO: Calculate score per second based on owned helpers
    return Object.values(this.state.store.helpers).map(h => this.calculateScore(h)).reduce((acc,val) => acc + val, 0)
  }
  getUpgrade(upgrade) {
    return this.state.store.upgrades[upgrade]
  }
  handleExportSave() {
    window.prompt(`Copy the following string`,btoa(this.mapGameState(this.state)))
  }
  handleImportSave() {
    const entry = window.prompt('Paste in your exported string')
    // TODO implement
  }
  handleStorePurchase(buyable) {
    if (!buyable.buyable) return
    
    const price = Math.floor(buyable.price * Math.pow(buyable.priceGrowth, buyable.purchased))

    if (buyable.currency === 'score') {
      if (this.state.stats.score >= price) {
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
            score: this.state.stats.score - price
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
    }
  }
  mapGameState(state) {
    return JSON.stringify(state)
  }
  newGame() {
    const state = this.getDefaultGameState()
    localStorage.setItem(Constants.LOCALSTORAGE_ITEM_NAME, this.mapGameState(state))
    this.setState(state)
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
      }
    })

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
  unmapGameState(mapped) {
    return JSON.parse(mapped)
    /*
    TODO: I guess this should implement some sort of version/upgrade save protocol
    const stats = previous.stats
    const store = previous.store

    if (!stats.hasOwnProperty('toxicity')) {
      stats.toxicity = 0
    }

    if (!stats.hasOwnProperty('blocks')) {
      stats.blocks = {
        blue: 0,
        green: 0
      }
    }

    return previous
    */
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
    const score = stats.score
    const scorePerSecond = this.getScorePerSecond()
    const toxicity = stats.toxicity

    return (
      <div className="App">
        <Grid>
          <Row>
            <GameNav
              autosave={autosave}
              autosaveHandle={this.toggleAutosave}
              exportSaveHandle={this.handleExportSave}
              importSaveHandle={this.handleImportSave}
              newGameHandle={this.newGame}
              saveGameHandle={this.saveGame} />
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
              <StorePanel onPurchase={this.handleStorePurchase} store={store} />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
