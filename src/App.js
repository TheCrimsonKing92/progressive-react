import React, { Component } from 'react';
import ButtonPanel from './ButtonPanel'
import GameNav from './GameNav'
import StatsPanel from './StatsPanel'
import StorePanel from './StorePanel'
import {Grid, Row, Col, Panel} from 'react-bootstrap'
import logo from './logo.svg';
import './App.css';

const LS_ITEM_NAME = 'ProgressiveReactSave'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = this.getGame();
    this.buttonClicked = this.buttonClicked.bind(this)
    this.newGame = this.newGame.bind(this)
    this.saveGame = this.saveGame.bind(this)
  }
  buttonClicked() {
    this.setState({
      stats:{
        clicks: this.state.stats.clicks + 1,
        score: this.state.stats.score + 1
      }
    })
  }
  getDefaultGameState() {
    return {
      stats: this.getDefaultStats(),
      store: this.getDefaultStore(),
    }
  }
  getDefaultStats() {
    return {
      clicks: 0,
      score: 0,
      toxicity: 0
    }
  }
  getDefaultStore() {
    return {
      helpers: [],
      upgrades: [],
      towers: []
    }
  }
  getGame() {
    const stored = localStorage.getItem(LS_ITEM_NAME)

    if (stored != null && stored.length > 0) {
      return this.unmapGameState(stored);
    } else {
      return this.getDefaultGameState();
    }
  }
  handleExportSave() {
    console.log(`Handle an export save request`)
  }
  handleImportSave() {
    console.log(`Handle an import save request`)
  }
  newGame() {
    const state = this.getDefaultGameState()
    localStorage.setItem(LS_ITEM_NAME, this.mapGameState(state))
    this.setState(state)
  }
  mapGameState(state) {
    return JSON.stringify(state)
  }
  saveGame() {
    localStorage.setItem(LS_ITEM_NAME, this.mapGameState(this.state))
  }
  unmapGameState(mapped) {
    const previous = JSON.parse(mapped)
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
  }
  render() {
    const stats = this.state.stats
    const store = this.state.store

    const blueBlocks = stats.blocks.blue
    const clicks = stats.clicks
    const greenBlocks = stats.blocks.green
    const score = stats.score
    const toxicity = stats.toxicity

    return (
      <div className="App">
        <Grid>
          <Row>
            <GameNav newGameHandle={this.newGame} saveGameHandle={this.saveGame} />
          </Row>
          <Row>
            <Col xs={12} md={3}>
              <ButtonPanel clickHandle={this.buttonClicked} />
            </Col>
            <Col xs={12} md={5}>
              <StatsPanel blueBlocks={blueBlocks} clicks={clicks} greenBlocks={greenBlocks} score={score} toxicity={toxicity} />
            </Col>
            <Col xs={12} md={4}>
              <StorePanel />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
