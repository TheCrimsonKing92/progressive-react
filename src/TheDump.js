import React, {Component} from 'react'
import './TheDump.css'

class TheDump extends Component {
  render() {
    return (
      <div className="TheDump" onClick={() => this.props.clickHandle()}></div>
    );
  }
}

export default TheDump