import moment from 'moment';
import React from 'react';
import bindAll from 'lodash/bindAll';
import { Grid, Col } from 'react-bootstrap';
import EventSource from 'sources/EventSource';
import Notification from '../models/Notification';
import { dateParam, weekDays } from 'helpers/DateHelper';

import Calendar from './calendar/Calendar';
import SideNav from './layout/SideNav';
import NotificationStack from './shared/alert/NotificationStack';
import CreateEventModal from './modal/CreateEventModal';

const { number, string, shape, array, arrayOf } = React.PropTypes;

export default class App extends React.Component {
  static propTypes = {
    initialEvents: array,
    weekLength: number,
    times: arrayOf(string).isRequired,
    location: shape({
      query: shape({
        date: string
      })
    }).isRequired,
    notificationTimeout: number
  };

  static defaultProps = {
    notificationTimeout: 10000
  };

  constructor(...args) {
    super(...args);

    this.state = {
      events: this.props.initialEvents,
      updating: false,
      notifications: [],
      showModal: false
    };

    bindAll(this,
      ['openModal', 'closeModal', 'handleCalendarRefresh', 'handleNotificationDismiss', 'handleEventDelete',
      'addNotification']);
  }

  componentDidMount() {
    if (!this.state.events) {
      this._fetchEvents();
    }
  }

  componentDidUpdate(prevProps) {
    const currentQuery = this.props.location.query;
    const prevQuery = prevProps.location.query;
    if (prevQuery && currentQuery && prevQuery.date === currentQuery.date) return;
    this._fetchEvents();
  }

  openModal() {
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false, errors: {} });
  }

  handleCalendarRefresh() {
    this._fetchEvents();
  }

  handleNotificationDismiss(notificationId) {
    this._removeNotification(notificationId);
  }

  handleEventDelete(eventId) {
    this._deleteEvent(eventId);
  }

  addNotification(notification) {
    notification.timeout = setTimeout(
      () => this._removeNotification(notification.id),
      this.props.notificationTimeout
    );
    this.setState({ notifications: this.state.notifications.concat([notification]) });
  }

  render() {
    const { initialEvents: _, ...calendarProps } = this.props;
    const { events, notifications, updating } = this.state;
    return (
      <div>
        <Grid>
          <Col xs={12} md={2}>
            <SideNav onRefresh={this.handleCalendarRefresh}
                     date={this._dateOrNow()}
                     updating={updating}
                     openModal={this.openModal} />
          </Col>
          <Col xs={12} md={10}>
            <Calendar {...calendarProps}
                      events={events}
                      days={weekDays(this._dateOrNow(), this.props.weekLength)}
                      times={this.props.times.map(time => moment(time))}
                      onDelete={this.handleEventDelete} />
          </Col>
        </Grid>
        <CreateEventModal closeModal={this.closeModal}
                          showModal={this.state.showModal}
                          conferenceRooms={this.props.conferenceRooms}
                          refresh={this.handleCalendarRefresh}
                          addNotification={this.addNotification}/>
        <NotificationStack notifications={notifications} onDismiss={this.handleNotificationDismiss} />
      </div>
    );
  }

  _dateOrNow() {
    const query = this.props.location.query;
    if (query && query.date) {
      return moment(query.date);
    }
    return moment().startOf('day');
  }

  _dateParam() {
    return dateParam(this._dateOrNow());
  }

  _fetchEvents() {
    this.setState({ updating: true });
    EventSource
      .fetch({ date: this._dateParam() })
      .then(({ data }) => {
        this.setState({ events: data, updating: false });
      })
      .catch(({ statusText, message }) => {
        const error = new Notification('danger', `Failed to fetch events: ${statusText || message}`);
        this._addNotification(error);
        this.setState({ updating: false });
      });
  }

  _deleteEvent(id) {
    EventSource.remove(id)
      .catch(() => {
        const error = new Notification('danger', 'Connection error');
        this._addNotification(error);
      });
    const events = this.state.events;
    const index = events.findIndex(event => event.id === id);
    events.splice(index, 1);
    this.setState({ events });
  }

  _removeNotification(id) {
    const notifications = this.state.notifications;
    const index = notifications.findIndex(notification => notification.id === id);
    if (index > -1) {
      clearTimeout(notifications[index].timeout);
      notifications.splice(index, 1);
      this.setState({ notifications });
    }
  }
}
