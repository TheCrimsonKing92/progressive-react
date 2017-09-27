import React, {Component} from 'react'

class TitleStat extends Component {
  constructor(props) {
    super(props)
  }
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