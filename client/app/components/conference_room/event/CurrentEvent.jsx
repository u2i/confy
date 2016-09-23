import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import requiredIf from 'react-required-if';
import { TIME_DISPLAY_FORMAT } from 'helpers/DateHelper';
import moment from 'moment';
import EventSchema from 'proptypes/schemas/EventSchema';
import Controls from '../layout/controls/Controls';
import TimeProgress from 'components/shared/time/TimeProgress';
import EventTime from 'components/calendar/event/details/EventTime';
import EventCreator from 'components/calendar/event/details/EventCreator';
import EventAttendees from 'components/calendar/event/details/EventAttendees';
import EventFullDescription from 'components/calendar/event/details/EventFullDescription';
import { If } from 'react-if';
import classNames from 'classnames';
import './current_event.scss';
import bindAll from 'lodash/bindAll';

const Event = ({ event }) => (
  <div>
    <h2 className="event-summary">{event.summary}</h2>
    <EventTime event={event} timeFormat={TIME_DISPLAY_FORMAT} />
    <EventCreator event={event} />
    <EventAttendees event={event} />
    <If condition={event.description != null}>
      <EventFullDescription description={event.description} />
    </If>
  </div>
);

Event.propTypes = {
  event: EventSchema.only('summary').isRequired
};

const NoEvent = () => <p>No event currently in progress</p>;

const TimeProgressContainer = ({ event, nextEventStart, onCompleted, displayEndTimeWarning }) => (
  <div className="text-center">
    <TimeProgress
      end={event ? moment(event.end.date_time) : nextEventStart}
      suffix={event ? 'left' : 'to next event'}
      displayEndTimeWarning={displayEndTimeWarning}
      onCompleted={onCompleted} />
  </div>
);

TimeProgressContainer.propTypes = {
  event: requiredIf(EventSchema.only('end'), props => !props.nextEventStart),
  nextEventStart: requiredIf(instanceOfMoment, props => !props.event),
  onCompleted: React.PropTypes.func,
  displayEndTimeWarning: React.PropTypes.func
};


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
        {this.props.event ? <Event event={this.props.event} /> : <NoEvent />}
        {this.props.event || this.props.nextEventStart ? <TimeProgressContainer event={this.props.event}
                                                          nextEventStart={this.props.nextEventStart}
                                                          displayEndTimeWarning={this._displayEndTimeWarning}
                                                          onCompleted={this._onCompleted} /> : ''}
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

  _displayEndTimeWarning() {
    this.setState({ endTimeWarning: true });
    setTimeout(() => this.setState({ endTimeWarning: false }), 4000);
  }

  _onCompleted() {
    this.setState({ endTimeWarning: false });
    this.props.onCompleted();
  }
}
