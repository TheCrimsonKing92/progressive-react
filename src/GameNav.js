import React, { Component } from 'react';
import {Navbar, Nav, NavItem} from 'react-bootstrap'

class GameNav extends Component {
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
              <NavItem eventKey={1} href="#" onClick={() => this.props.newGameHandle()}>New Game</NavItem>
              <NavItem eventKey={2} href="#" onClick={() => this.props.saveGameHandle()}>Save Game</NavItem>
              <NavItem eventKey={3} href="#" onClick={() => this.props.exportSaveHandle()}>Export Save</NavItem>
              <NavItem eventKey={4} href="#" onClick={() => this.props.importSaveHandle()}>Import Save</NavItem>
              <NavItem eventKey={5} href="#" onClick={() => this.props.autosaveHandle()}>Autosave Every {`${this.props.autosave} Second${this.props.autosave === 1 ? '' : 's'}`}</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default GameNav