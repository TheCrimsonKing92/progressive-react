import React, {PureComponent} from 'react'
import {Panel} from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'
import TheButton from './TheButton'
import TheDump from './TheDump'

class ButtonPanel extends PureComponent {
  render() {
    return (
      <div className="ButtonPanel">
        <Panel>
          <p data-tip="Click to start earning score!">The Button</p>
          <TheButton clickHandle={this.props.buttonHandle} />
          <p data-tip="Click to remove toxicity">The Dump</p>
          <TheDump clickHandle={this.props.dumpHandle} />
          <ReactTooltip />
        </Panel>
      </div>
    );
  }
}

export default ButtonPanel