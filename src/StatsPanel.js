import React, {Component} from 'react'
import {Row, Col, Panel} from 'react-bootstrap'
import TitleStat from './TitleStat'

class StatsPanel extends Component {
  render() {
    const blueBlocks = this.props.blueBlocks
    const clicks = this.props.clicks
    const greenBlocks = this.props.greenBlocks
    const score = this.props.score
    const toxicity = this.props.toxicity

    return (
      <div className="StatsPanel">
        <Panel>
          <p>Stats</p>
          <Row>
            <Col xs={12} md={4}>
              <TitleStat title={'Clicks'} stat={clicks} />
            </Col>
            <Col xs={12} md={4}>
              <TitleStat title={'Score'} stat={score} />
            </Col>
            <Col xs={12} md={4}>
              <TitleStat title={'Toxicity'} stat={toxicity} />
            </Col>
            <Col xs={12} md={4}>
              <TitleStat title={'Blue Blocks'} stat={blueBlocks} />
            </Col>
            <Col xs={12} md={4}>
              <TitleStat title={'Green Blocks'} stat={greenBlocks} />
            </Col>
          </Row>
        </Panel>
      </div>
    );
  }
}

export default StatsPanel