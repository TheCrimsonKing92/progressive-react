import React, {Component} from 'react'
import {Panel} from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'
import TheButton from './TheButton'

class ButtonPanel extends Component {
  render() {
    return (
      <div className="ButtonPanel">
        <Panel>
          <p data-tip="Click to start earning score!">The Button</p>
          <ReactTooltip />
          <TheButton clickHandle={this.props.clickHandle} />
        </Panel>
      </div>
    );
  }
}

export default ButtonPanel