import React, {PureComponent} from 'react'
import { idMap } from './store-panel-commons'
import { Row } from 'react-bootstrap'

class Helpers extends PureComponent {
  render() {
    const helpers = this.props.helpers
    const helperElements = Object.values(helpers)
																 .map(idMap)
                                 .map(this.props.mapBuyable)
    return(
      <Row>
        <p>Helpers</p>
        { helperElements }
      </Row>
    )
  }
}

export default Helpers