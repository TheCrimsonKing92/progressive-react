import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import ReactTooltip from 'react-tooltip'

const getClassName = name => name.replace(' ', '-')
                                 .replace(/\./g, '-')
                                 .toLowerCase()
const isFadeable = type => (type === 'tower' || type === 'upgrade')
const noSelect = {
  userSelect: 'none'
}
class Buyable extends Component {
  constructor(props) {
    super(props)

    this.state = {
      className: getClassName(this.props.buyable.name)
    }

    this.handlePurchase = this.handlePurchase.bind(this)
  }
  componentWillUnmount() {
    ReactTooltip.hide(findDOMNode(this.refs.tooltip))
  }
  handlePurchase(buyable) {
    this.props.onPurchase(buyable)
  }
  shouldComponentUpdate(nextProps) {
    if (nextProps.buyable.currentPrice !== this.props.buyable.currentPrice ||
        nextProps.buyable.purchased !== this.props.buyable.purchased ||
        nextProps.buyable.tooltip !== this.props.buyable.tooltip) {
      return true
    }

    return false
  }
  render() {
    const fade = isFadeable(this.props.buyable.type) && this.props.fade && !this.props.buyable.buyable ? ' faded' : ''

    return (
      <div 
        data-tip
        data-for={`buyable${this.state.className}`}
        key={this.props.buyable.id}
        className={`buyable ${this.state.className}${fade}`}
        style={noSelect}
        onClick={() => this.handlePurchase(this.props.buyable)}
      >
        <ReactTooltip
          ref='tooltip'
          border={true}
          getContent={[() => this.props.buyable.tooltip, 100]}
          id={`buyable${this.state.className}`} 
          html={true}
        />
      </div>
    )
  }
}

export default Buyable