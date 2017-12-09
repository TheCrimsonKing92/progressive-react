import React from 'react'
import Modal from 'react-responsive-modal'
import { Row, Col, Button } from 'react-bootstrap'

class NewGameModal extends React.Component {
  render() {
    return (
      <Modal { ...this.props } closeOnEsc={true} showCloseIcon={false}>
        <Row>
          <Col xs={12}>
            <p>Are you sure you want to start a new game?</p>
          </Col>              
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <Button block onClick={this.props.onClose}>No</Button> 
          </Col>
          <Col xs={12} md={6}>
            <Button block onClick={this.props.newGame}>Yes</Button>
          </Col>
        </Row>
      </Modal>
    )    
  }
}

export default NewGameModal