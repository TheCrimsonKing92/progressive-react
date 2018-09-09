import React, {PureComponent} from 'react'
import './TheDump.css'

class TheDump extends PureComponent {
  render() {
    return (
      <div className="TheDump" onClick={() => this.props.clickHandle()}></div>
    );
  }
}

export default TheDump