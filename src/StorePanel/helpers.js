import React, {PureComponent} from 'react'
import { asSequence } from 'sequency'
import { idMap } from './store-panel-commons'
import { Row } from 'react-bootstrap'

class Helpers extends PureComponent {
  render() {
    const helpers = this.props.helpers
    const helperElements = asSequence(Object.values(helpers))
                              .mapIndexed(idMap)
                              .map(this.props.mapBuyable)
                              .toArray()
    return(
      <Row>
        <p>Helpers</p>
        { helperElements }
      </Row>
    )
  }
}

export default Helpers