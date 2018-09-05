import React, {PureComponent} from 'react'
import {findDOMNode} from 'react-dom'
import ReactTooltip from 'react-tooltip'

const getClassName = name => name.replace(' ', '-')
                                 .replace(/\./g, '-')
                                 .toLowerCase()
const isFadeable = type => (type === 'tower' || type === 'upgrade')
class Buyable extends PureComponent {
  constructor(props) {
    super(props)

    this.handlePurchase = this.handlePurchase.bind(this)
  }
  componentWillUnmount() {
    ReactTooltip.hide(findDOMNode(this.refs.tooltip))
  }
  handlePurchase(buyable) {
    this.props.onPurchase(buyable)
  }
  render() {
    const className = getClassName(this.props.buyable.name)
    
    const fade = isFadeable(this.props.buyable.type) && this.props.fade && !this.props.buyable.buyable ? ' faded' : ''

    return (
      <div data-tip data-for={`buyable${className}`} key={this.props.buyable.id} className={`buyable ${className}${fade}`} style={{ 'userSelect': "none"}} onClick={() => this.handlePurchase(this.props.buyable)}>
        <ReactTooltip ref='tooltip' border={true} getContent={[() => this.props.buyable.tooltip, 150]} id={`buyable${className}`}  html={true}/>
      </div>
    )
  }
}

export default Buyable