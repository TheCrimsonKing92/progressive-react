import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap'

class GameNav extends Component {
  constructor(props) {
    super(props)

    this.handleExportSave = this.emitExportSaveRequest.bind(this)
    this.handleImportSave = this.handleImportSave.bind(this)
    this.emitNewGameRequest = this.emitNewGameRequest.bind(this)
    this.handleSaveGame = this.emitSaveGameRequest.bind(this)
    this.toggleAutosave = this.toggleAutosave.bind(this)
  }
  emitExportSaveRequest() {
    this.props.exportSaveHandle()
  }
  handleImportSave() {
    this.props.importSaveHandle()
  }
  emitNewGameRequest() {
    this.props.newGameHandle()
  }
  emitSaveGameRequest() {
    this.props.saveGameHandle()
  }
  toggleAutosave() {
    this.props.autosaveHandle()
  }
  render() {
    const frequency = `${this.props.autosave} Second${this.props.autosave === 1 ? '' : 's'}`
    return (
      <div className="GameNav">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
                Progressive React
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} href="#" onClick={this.emitNewGameRequest}>New Game</NavItem>
              <NavItem eventKey={2} href="#" onClick={this.handleSaveGame}>Save Game</NavItem>
              <NavItem eventKey={3} href="#" onClick={this.handleExportSave}>Export Save</NavItem>
              <NavItem eventKey={4} href="#" onClick={this.handleImportSave}>Import Save</NavItem>
              <NavItem eventKey={5} href="#" onClick={this.toggleAutosave}>Autosave Every {frequency}</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default GameNav