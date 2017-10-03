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
    let base = `${buyable.name}</br>${buyable.description}</br>${buyable.multiple ? 'Next costs' : 'Costs'} ${price} ${buyable.currency}`

    if (!buyable.multiple) return base
    return `${base}</br>${buyable.purchased} Purchased`
  }
  handlePurchase(buyable) {
    this.props.onPurchase(buyable)
  }
  render() {
    const className = this.props.buyable.name.replace(' ', '-').toLowerCase()
    const id = this.props.buyable.id

    return (
      <div data-tip data-for={`buyable${id}`} key={id} className={`buyable ${className}`} onClick={() => this.handlePurchase(this.props.buyable)}>
        <ReactTooltip ref='tooltip' border={true} getContent={[() => this.getTooltip(), 200]} id={`buyable${id}`}  html={true}/>
      </div>
    )
  }
}

export default Buyable