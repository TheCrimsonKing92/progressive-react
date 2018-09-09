import React, {PureComponent} from 'react'
import ReactTooltip from 'react-tooltip'

class TooltipTitleStat extends PureComponent {
  render() {
    return (
      <div className="TitleStat">
        <label data-tip data-for={this.props.title}>
          {this.props.title}
        </label>
        <p>{this.props.stat}</p>
        <ReactTooltip html={true} id={this.props.title}>
          {this.props.tooltip}
        </ReactTooltip>
      </div>
    )
  }
}

export default TooltipTitleStat