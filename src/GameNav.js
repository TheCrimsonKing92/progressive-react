import React, { PureComponent } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap'

class GameNav extends PureComponent {
  render() {
    return (
      <div className="GameNav">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
                Progressive Game
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <NavItem href="#" onClick={this.props.openHelpModal}>Help</NavItem>
              <NavItem href="#" onClick={this.props.openNewGameModal}>New Game</NavItem>
              <NavItem href="#" onClick={this.props.saveGame}>Save Game</NavItem>
              <NavItem href="#" onClick={this.props.handleExportSave}>Export Save</NavItem>
              <NavItem href="#" onClick={this.props.handleImportSave}>Import Save</NavItem>
              <NavItem href="#" onClick={this.props.toggleAutosave}>{this.props.autosaveText}</NavItem>
              <NavItem href="#" onClick={this.props.togglePurchaseHandling}>{this.props.purchaseText}</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default GameNav