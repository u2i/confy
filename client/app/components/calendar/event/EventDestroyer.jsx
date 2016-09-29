import React, { PropTypes } from 'react';
import { If, Else } from 'react-if';
import bindAll from 'lodash/bindAll';
import DeleteButton from './DeleteButton';
import DeleteConfirmation from './DeleteConfirmation';
import EventSchema from 'schemas/EventSchema';
import './event.scss';

export default class EventDestroyer extends React.Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    event:    EventSchema.except('creator').isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showIndicator: false,
      showConfirmationModal: false
    };

    bindAll(this, ['_handleOnClick', '_handleConfirmDeletion', '_hideConfirmationModal']);
  }

  render() {
    return (
      <div>
        <DeleteButton onClick={this._handleOnClick} ref="target" />
        <DeleteConfirmation show={this.state.showConfirmationModal}
                            onCancel={this._hideConfirmationModal}
                            onConfirm={this._handleConfirmDeletion}
                            onHide={this._hideConfirmationModal}
                            event={this.props.event} />
      </div>
    );
  }

  _hideConfirmationModal() {
    this.setState({ showConfirmationModal: false });
  }

  _handleConfirmDeletion() {
    this._hideConfirmationModal();
    return this.props.onDelete();
  }

  _handleOnClick(event) {
    event.stopPropagation();
    this.setState({ showConfirmationModal: true });
  }
}
