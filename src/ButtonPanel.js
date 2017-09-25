import React, {Component} from 'react'
import {Panel} from 'react-bootstrap'
import TheButton from './TheButton'

class ButtonPanel extends Component {
  render() {
    return (
      <div className="ButtonPanel">
        <Panel>
          <TheButton />
        </Panel>
      </div>
    );
  }
}

export default ButtonPanel