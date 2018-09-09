import React, {PureComponent} from 'react'
import { idMap, isBuyable, isOneTimeBuyable } from './store-panel-commons'
import { Row } from 'react-bootstrap'

class Towers extends PureComponent {
  render() {
    const towers = this.props.towers
    const singularFilter = this.props.purchaseHandling ? isOneTimeBuyable : isBuyable
    const towerElements = Object.values(towers)
                                .filter(singularFilter)
																.map(idMap)
                                .map(this.props.mapBuyable)

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