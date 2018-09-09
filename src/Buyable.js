import React, {PureComponent} from 'react'
import {findDOMNode} from 'react-dom'
import ReactTooltip from 'react-tooltip'

import Constants from './Constants'

const getClassName = name => name.replace(' ', '-')
                                 .replace(/\./g, '-')
                                 .toLowerCase()
const isFadeable = type => (type === Constants.BUYABLE_TYPE.TOWER || type === Constants.BUYABLE_TYPE.UPGRADE)
const noSelect = {
  userSelect: 'none'
}
class Buyable extends PureComponent {
  constructor(props) {
    super(props)    
    this.handlePurchase = this.handlePurchase.bind(this)
  }
  componentWillUnmount() {
    ReactTooltip.hide(findDOMNode(this.refs.tooltip))
  }
  handlePurchase(name = this.props.name, type = this.props.type) {
    this.props.onPurchase(name, type)
  }
  render() {
    const className = getClassName(this.props.name)
    const fade = isFadeable(this.props.type) && this.props.fade & !this.props.buyable ? ' faded': ''
    return (
      <div
        data-tip
        data-for={`buyable${className}`}
        key={this.props.id}
        className={`buyable ${className}${fade}`}
        style={noSelect}
        onClick={() => this.handlePurchase()}
      >
        <ReactTooltip
          ref='tooltip'
          border={true}
          getContent={[() => this.props.tooltip, 100]}
          id={`buyable${className}`}
          html={true}
        />
      </div>
    )
  }
}

export default Buyable