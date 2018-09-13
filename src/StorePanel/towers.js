import React, {PureComponent} from 'react'
import { asSequence } from 'sequency'
import { idMap, isBuyable, isOneTimeBuyable } from './store-panel-commons'
import { Row } from 'react-bootstrap'

class Towers extends PureComponent {
  render() {
    const towers = this.props.towers
    const singularFilter = this.props.purchaseHandling ? isOneTimeBuyable : isBuyable
    const towerElements = asSequence(Object.values(towers))
                                .filter(singularFilter)
																.mapIndexed(idMap)
                                .map(this.props.mapBuyable)
                                .toArray()

    if (!towerElements.some(t => t)) return null

    return(
      <Row>
        <p>Towers</p>
        { towerElements }
      </Row>
    )
  }
}

export default Towers