import React, { PropTypes } from 'react';
import { If, Else } from 'react-if';
import bindAll from 'lodash/bindAll';
import DeleteButton from 'components/calendar/event/DeleteButton';
import DeleteTooltip from 'components/calendar/event/DeleteTooltip';
import DeleteConfirmation from 'components/calendar/event/DeleteConfirmation';
import './event.scss';


export default class EventDestroyer extends React.Component {
  static propTypes = {
    onDelete: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
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
    const enabled = this.props.disabled ? 'disabled' : 'enabled';

    const button = (
      <span onClick={this._handleOnClick}
            className={`delete-button glyphicon glyphicon-remove ${enabled}`}
            ref="target">
      </span>
    );

    return (
      <div>
        <DeleteButton onClick={this._handleOnClick} disabled={this.props.disabled} ref="target" />
        <If condition={this.props.disabled}>
          <DeleteTooltip show={this.state.showIndicator} target={() => this.refs.target} />
          <Else>
            <DeleteConfirmation show={this.state.showConfirmationModal}
                                cancelHandler={this._hideConfirmationModal}
                                confirmHandler={this._handleConfirmDeletion}
                                onHide={this._hideConfirmationModal} />
          </Else>
        </If>
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

  _handleOnClickEnabled() {
    this.setState({ showConfirmationModal: true });
  }

  _handleOnClickDisabled() {
    this.setState({
      showIndicator: true
    });

    setTimeout(() => this.setState({ showIndicator: false }), 2000);

    return false;
  }

  _handleOnClick() {
    if (!this.props.disabled) {
      return this._handleOnClickEnabled();
    }
    return this._handleOnClickDisabled();
  }
}
