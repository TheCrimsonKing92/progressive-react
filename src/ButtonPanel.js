import React, {Component} from 'react'
import {Panel} from 'react-bootstrap'
import ReactTooltip from 'react-tooltip'
import TheButton from './TheButton'

class ButtonPanel extends Component {
  constructor(props) {
    super(props)
    this.handleButtonClick = this.handleButtonClick.bind(this)
  }
  handleButtonClick() {
    console.log('ButtonPanel click handler called')
    this.props.clickHandle()
  }
  render() {
    return (
      <div className="ButtonPanel">
        <Panel>
          <p data-tip="Click to start earning score!">The Button</p>
          <ReactTooltip />
          <TheButton clickHandle={this.handleButtonClick} />
        </Panel>
      </div>
    );
  }
}

export default ButtonPanel