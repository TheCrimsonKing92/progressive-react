import React, {PureComponent} from 'react'
import { isBuyable, isOneTimeBuyable, mapElements } from './store-panel-commons'
import { Row } from 'react-bootstrap'

class Upgrades extends PureComponent {
  render() {
    const singularFilter = this.props.purchaseHandling ? isOneTimeBuyable : isBuyable
    const upgradeElements = mapElements(this.props.upgrades, this.props.mapBuyable, singularFilter)

    if (!upgradeElements.some(u => u)) return null
    
    return(
      <Row>
        <p>Upgrades</p>
        { upgradeElements }
      </Row>
    )
  }
}

export default Upgrades