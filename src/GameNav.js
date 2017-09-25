import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap'

class GameNav extends Component {
  emitExportSaveRequest() {
    // TODO: Implement
  }
  emitImportSaveRequest() {
    // TODO: Implement
  }
  emitNewGameRequest() {
    // TODO: Implement
  }
  emitSaveGameRequest() {
    // TODO: Implement
  }
  render() {
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
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default GameNav