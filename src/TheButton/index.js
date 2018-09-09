import React, {PureComponent} from 'react'
import './TheButton.css'

class TheButton extends PureComponent {
  render() {
    return (
      <div className="TheButton" onClick={() => this.props.clickHandle()}></div>
    );
  }
}

export default TheButton