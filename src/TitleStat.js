import React, {PureComponent} from 'react'

class TitleStat extends PureComponent {
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