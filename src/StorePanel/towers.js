import React, {PureComponent} from 'react'
import { isBuyable, isOneTimeBuyable, mapElements } from './store-panel-commons'
import { Row } from 'react-bootstrap'

class Towers extends PureComponent {
  render() {
    const singularFilter = this.props.purchaseHandling ? isOneTimeBuyable : isBuyable
    const towerElements = mapElements(this.props.towers, this.props.mapBuyable, singularFilter)

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