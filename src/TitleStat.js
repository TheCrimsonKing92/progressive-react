import React, {Component} from 'react'

class TitleStat extends Component {
  render() {
    return (
      <div className="TitleStat">
        <label>
          {this.props.title}
        </label>
        <p>{this.props.stat}</p>
      </div>
    )
  }
}

export default TitleStat