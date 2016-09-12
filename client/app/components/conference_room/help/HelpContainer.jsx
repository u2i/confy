import React from 'react';

import Help from './Help';
import HelpButton from './HelpButton';

export default class HelpContainer extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = { showModal: false };

    this.handleHideModal = this.handleHideModal.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
  }

  handleShowModal() {
    this.setState({ showModal: true });
  }

  handleHideModal() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div>
        <HelpButton onClick={this.handleShowModal} />
        <Help show={this.state.showModal} onHide={this.handleHideModal} />
      </div>
    );
  }
}
