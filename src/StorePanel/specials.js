import React, {PureComponent} from 'react'
import { isBuyable, mapElements } from './store-panel-commons'
import { Row } from 'react-bootstrap'

class Specials extends PureComponent {
  render() {
    const specialElements = mapElements(this.props.specials, this.props.mapBuyable, isBuyable)

    if (!specialElements.some(s => s)) return null

    return(
      <Row>
        <p>Specials</p>
        { specialElements }
      </Row>
    )
  }
}

export default Specials