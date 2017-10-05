import React, { Component } from 'react';
import {Navbar, Nav} from 'react-bootstrap'

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
              {this.props.children}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default GameNav