import React, { Component } from 'react';
import ButtonPanel from './ButtonPanel'
import GameNav from './GameNav'
import StatsPanel from './StatsPanel'
import StorePanel from './StorePanel'
import {Grid, Row, Col, Panel} from 'react-bootstrap'
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: this.getStats(),
      store: this.getStore()
    };
  }
  getStats() {
    
  }
  getStore() {

  }
  handleExportSave() {
    console.log(`Handle an export save request`)
  }
  handleImportSave() {
    console.log(`Handle an import save request`)
  }
  handleNewGame() {
    console.log(`Handle a new game request`);
  }
  handleSaveGame() {
    console.log(`Handle a save game request`)
  }
  render() {
    return (
      <div className="App">
        <Grid>
          <Row>
            <GameNav />
          </Row>
          <Row>
            <Col xs={12} md={4}>
              <ButtonPanel />
            </Col>
            <Col xs={12} md={4}>
              <StatsPanel />
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
