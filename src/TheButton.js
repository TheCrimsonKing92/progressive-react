import React, {Component} from 'react'
import './TheButton.css'

class TheButton extends Component {
  constructor(props) {
    super(props)
    this.onClicked = this.onClicked.bind(this);
  }
  onClicked(e) {
    this.props.clickHandle()
  }
  render() {
    return (
      <div className="TheButton" onClick={this.onClicked}></div>
    );
  }
}

export default TheButton