import React, {Component} from 'react'
import './TheButton.css'

class TheButton extends Component {
  render() {
    return (
      <div className="TheButton" onClick={() => this.props.clickHandle()}></div>
    );
  }
}

export default TheButton