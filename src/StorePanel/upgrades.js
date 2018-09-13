import React, {PureComponent} from 'react'
import { asSequence } from 'sequency'
import { idMap, isBuyable, isOneTimeBuyable } from './store-panel-commons'
import { Row } from 'react-bootstrap'

class Upgrades extends PureComponent {
  render() {
    const upgrades = this.props.upgrades
    const singularFilter = this.props.purchaseHandling ? isOneTimeBuyable : isBuyable
    const upgradeElements = asSequence(Object.values(upgrades))
                                  .filter(singularFilter)
                                  .mapIndexed(idMap)
                                  .map(this.props.mapBuyable)
                                  .toArray()

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