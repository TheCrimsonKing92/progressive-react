import React, {Component} from 'react'
import {Row, Col, Panel} from 'react-bootstrap'
import TitleStat from './TitleStat'
import TooltipTitleStat from './TooltipTitleStat'

class StatsPanel extends Component {
  render() {
    const blueBlocks = this.props.blueBlocks
    const clicks = this.props.clicks
    const clickScore = this.props.clickScore
    const greenBlocks = this.props.greenBlocks
    const score = this.props.score
    const scorePerSecond = this.props.scorePerSecond
    const selectedClass = this.props.selectedClass
    const toxicity = this.props.toxicity
    const toxicityCutoff = this.props.toxicityCutoff
    const toxicityCutoffHalf = this.props.toxicityCutoffHalf
    const toxicityPerSecond = this.props.toxicityPerSecond

    const toxicityTooltip = `At ${toxicityCutoffHalf} toxicity, helpers produce 10% less score</br>Over ${toxicityCutoff} toxicity, helpers produce 50% less score.</br>`

    return (
      <div className="StatsPanel">
        <Panel>
          <p>Stats</p>
          <Row>
            <Col xs={6} sm={4}>
              <TitleStat title={'Class'} stat={selectedClass} />
            </Col>
            <Col xs={6} sm={4}>
              <TitleStat title={'Clicks'} stat={clicks} />
            </Col> 
            <Col xs={6} sm={4}>
              <TitleStat title={'Score'} stat={score} />
            </Col>
            <Col xs={6} sm={4}>
              <TitleStat title={'Score / click'} stat={clickScore} />
            </Col>
            <Col xs={6} sm={4}>
              <TitleStat title={'Score / s'} stat={scorePerSecond} />
            </Col>
            <Col xs={6} sm={4}>
              <TooltipTitleStat title={'Toxicity'} stat={toxicity} tooltip={toxicityTooltip} />
            </Col>
            <Col xs={6} sm={4}>
              <TooltipTitleStat title={'Toxicity / s'} stat={toxicityPerSecond} />
            </Col>
            <Col xs={6} sm={4}>
              <TitleStat title={'Blue Blocks'} stat={blueBlocks} />
            </Col>
            <Col xs={6} sm={4}>
              <TitleStat title={'Green Blocks'} stat={greenBlocks} />
            </Col>
          </Row>
        </Panel>
      </div>
    );
  }
}

export default StatsPanel