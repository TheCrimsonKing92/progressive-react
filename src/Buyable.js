import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import ReactTooltip from 'react-tooltip'

class Buyable extends Component {
  constructor(props) {
    super(props)

    this.getTooltip = this.getTooltip.bind(this)
    this.handlePurchase = this.handlePurchase.bind(this)
  }
  componentWillUnmount() {
    ReactTooltip.hide(findDOMNode(this.refs.tooltip))
  }
  getTooltip() {
    const buyable = this.props.buyable

    const price = Math.floor(buyable.price * Math.pow(buyable.priceGrowth, buyable.purchased))
    const base = `${buyable.name}</br>${buyable.description}</br>${buyable.multiple ? 'Next costs' : 'Costs'} ${price.toLocaleString()} ${buyable.currency}`

    if (!buyable.multiple) return base
    return `${base}</br>${buyable.purchased} Purchased`
  }
  handlePurchase(buyable) {
    this.props.onPurchase(buyable)
  }
  render() {
    const className = this.props.buyable.name.replace(' ', '-').toLowerCase()
    const id = this.props.buyable.id
    
    const fade = this.props.buyable.type === 'upgrade' && this.props.fade && !this.props.buyable.buyable ? ' faded' : ''

    return (
      <div data-tip data-for={`buyable${className}`} key={id} className={`buyable ${className}${fade}`} style={{ 'userSelect': "none"}} onClick={() => this.handlePurchase(this.props.buyable)}>
        <ReactTooltip ref='tooltip' border={true} getContent={[() => this.getTooltip(), 200]} id={`buyable${className}`}  html={true}/>
      </div>
    )
  }
}

export default Buyable