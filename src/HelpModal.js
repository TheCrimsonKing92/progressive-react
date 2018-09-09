import React from 'react'
import Modal from 'react-responsive-modal'

class HelpModal extends React.PureComponent {
  render() {
    return (
      <Modal closeOnEsc={true} {...this.props} showCloseIcon={true}>
        <h4>Help! What is all this?</h4>
        <p>Progressive Game is just that-- progressive! New upgrades and types of buyables will become available as you go on.</p>
        <p>Your primary resource is score: Use it to buy helpers (to automate score gain) and upgrades.</p>
        <p>The Button is your first and primary source of score. Get tapping to get started!</p>
        <p>Blocks (blue and green) are an advanced resource produced by consumers, in the mid-to-late phase of the game.</p>
        <p>Speaking of consumers, they also produce toxicity, which can affect your score output. Be careful!</p>
        <p>The Dump can help you get rid of toxicity, at least for a while.</p>
        <p>If you haven't already, pick a class (with a unique bonus) to get started.</p>
      </Modal>
    )
  }
}

export default HelpModal