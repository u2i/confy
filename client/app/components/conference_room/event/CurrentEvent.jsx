import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import EventSchema from 'proptypes/schemas/EventSchema';
import Controls from '../layout/controls/Controls';
import Event from 'components/conference_room/event/Event';
import NoEvent from 'components/conference_room/event/NoEvent';
import TimeProgressContainer from 'components/conference_room/event/TimeProgressContainer';
import classNames from 'classnames';
import './current_event.scss';
import bindAll from 'lodash/bindAll';

export default class CurrentEvent extends React.Component {
  static propTypes = {
    event: EventSchema.except('width', 'offset'),
    nextEventStart: instanceOfMoment,
    onCompleted: React.PropTypes.func,
    onConfirm: React.PropTypes.func,
    onFinish: React.PropTypes.func,
    onCreate: React.PropTypes.func,
    onCancel: React.PropTypes.func
  };

  static defaultProps = {
    onCompleted: () => {}
  };

  constructor(...args) {
    super(...args);

    bindAll(this, ['_displayEndTimeWarning', '_onCompleted']);
    this.state = { endTimeWarning: false };
  }

  render() {
    return (
      <div className={this._className()}>
        {this._eventComponent()}
        {this._timeProgressComponent()}
        <Controls event={this.props.event}
                  onConfirm={this.props.onConfirm}
                  onFinish={this.props.onFinish}
                  onCreate={this.props.onCreate}
                  nextEventStart={this.props.nextEventStart}
                  onCancel={this.props.onCancel} />
      </div>
    );
  }

  _className() {
    return classNames(
      'current-event-container',
      'event-container',
      { 'end-time-warning': this.state.endTimeWarning }
    );
  }

  _eventComponent() {
    return this.props.event ? <Event event={this.props.event} /> : <NoEvent />;
  }

  _timeProgressComponent() {
    if (this.props.event || this.props.nextEventStart) {
      return (
        <TimeProgressContainer event={this.props.event}
                               nextEventStart={this.props.nextEventStart}
                               displayEndTimeWarning={this._displayEndTimeWarning}
                               onCompleted={this._onCompleted} />);
    }
    return '';
  }

  _displayEndTimeWarning() {
    this.setState({ endTimeWarning: true });
    setTimeout(() => this.setState({ endTimeWarning: false }), 4000);
  }

  _onCompleted() {
    this.setState({ endTimeWarning: false });
    this.props.onCompleted();
  }
}
