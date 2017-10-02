import React, {Component} from 'react'
import ReactTooltip from 'react-tooltip'

class Buyable extends Component {
  constructor(props) {
    super(props)

    this.getTooltip = this.getTooltip.bind(this)
    this.handlePurchase = this.handlePurchase.bind(this)
  }
  componentWillUnmount() {
    ReactTooltip.hide()
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
    const tooltip = this.getTooltip(this.props.buyable)

    return (
      <div data-tip={tooltip} data-for={`buyable${id}`} key={id} className={`buyable ${className}`} onClick={() => this.handlePurchase(this.props.buyable)}>
        <ReactTooltip border={true} id={`buyable${id}`}  html={true}/>
      </div>
    )
  }
}

export default Buyable