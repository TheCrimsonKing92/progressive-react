import React from 'react'
import Modal from 'react-responsive-modal'

class ExportGameModal extends React.Component {
  render() {
    const { game, ...props } = this.props
    const styles = {
      wordWrap: 'break-word'
    };

    return (
      <Modal center closeOnEsc={true} showCloseIcon={true} {...props}>
        <h4>
          Copy the following string:
        </h4>
        <p style={styles}>
          { game }
        </p>
      </Modal>
    )
  }
}

export default ExportGameModal