import React, {PureComponent} from 'react'
import { idMap, isBuyable } from './store-panel-commons'
import { Row } from 'react-bootstrap'

class Specials extends PureComponent {
  render() {
    const specials = this.props.specials
    const specialElements = Object.values(specials)
                                  .filter(isBuyable)
                                  .map(idMap)
                                  .map(this.props.mapBuyable)

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