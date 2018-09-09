import React, {PureComponent} from 'react'
import { idMap, isBuyable, isOneTimeBuyable, mapBuyable } from './store-panel-commons'
import { Row } from 'react-bootstrap'

class Upgrades extends PureComponent {
  render() {
    const upgrades = this.props.upgrades
    const singularFilter = this.props.purchaseHandling ? isOneTimeBuyable : isBuyable
    const upgradeElements = Object.values(upgrades)
                                  .filter(singularFilter)
                                  .map(idMap)
                                  .map(this.props.mapBuyable)

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