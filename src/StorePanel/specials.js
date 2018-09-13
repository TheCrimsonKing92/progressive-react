import React, {PureComponent} from 'react'
import { asSequence } from 'sequency'
import { idMap, isBuyable } from './store-panel-commons'
import { Row } from 'react-bootstrap'

class Specials extends PureComponent {
  render() {
    const specials = this.props.specials
    const specialElements = asSequence(Object.values(specials))
                                  .filter(isBuyable)
                                  .mapIndexed(idMap)
                                  .map(this.props.mapBuyable)
                                  .toArray()

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