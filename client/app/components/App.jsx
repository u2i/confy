import React, { PropTypes } from 'react';
import moment from 'moment';
import { Grid, Col } from 'react-bootstrap';
import EventSource from 'sources/EventSource';
import Notification from '../models/Notification';
import { DATE_PARAM_FORMAT, weekDays } from 'helpers/DateHelper';

import Calendar from './calendar/Calendar';
import SideNav from './layout/SideNav';
import NotificationStack from './shared/alert/NotificationStack';

export default class App extends React.Component {
  static propTypes = {
    initialEvents:       PropTypes.array,
    weekLength:          PropTypes.number,
    location:            PropTypes.shape({
      query: PropTypes.shape({
        date: PropTypes.string
      })
    }).isRequired,
    notificationTimeout: PropTypes.number
  };

  static defaultProps = {
    notificationTimeout: 10000
  };

  constructor(...args) {
    super(...args);

    this.state = {
      events:        this.props.initialEvents,
      updating:      false,
      notifications: []
    };

    this.handleCalendarRefresh = this.handleCalendarRefresh.bind(this);
    this.handleNotificationDismiss = this.handleNotificationDismiss.bind(this);
    this.handleEventDelete = this.handleEventDelete.bind(this);
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

  handleCalendarRefresh() {
    this._fetchEvents();
  }

  handleNotificationDismiss(notificationId) {
    this._removeNotification(notificationId);
  }

  handleEventDelete(eventId) {
    this._deleteEvent(eventId);
  }

  render() {
    const { initialEvents: _, ...calendarProps } = this.props;
    const { events, notifications, updating } = this.state;
    return (
      <div>
        <Grid>
          <Col xs={12} md={2}>
            <SideNav onRefresh={this.handleCalendarRefresh}
                     date={this._dateParam()}
                     updating={updating} />
          </Col>
          <Col xs={12} md={10}>
            <Calendar {...calendarProps}
                      events={events}
                      days={weekDays(this._dateParam(), this.props.weekLength)}
                      onDelete={this.handleEventDelete} />
          </Col>
        </Grid>
        <NotificationStack notifications={notifications} onDismiss={this.handleNotificationDismiss} />
      </div>
    );
  }

  _dateParam() {
    const query = this.props.location.query;
    if (query && query.date) {
      return query.date;
    }
    return moment().format(DATE_PARAM_FORMAT);
  }

  _fetchEvents() {
    this.setState({ updating: true });
    EventSource
      .fetch({ date: this._dateParam() })
      .then(({ data }) => {
        this.setState({ events: data, updating: false });
      })
      .catch((err) => {
        const error = new Notification('danger', `Failed to fetch events: ${err}`);
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
    for (const row of events) {
      const index = row.findIndex(event => event.id === id);
      if (index >= 0) {
        row.splice(index, 1);
        break;
      }
    }
    this.setState({ events });
  }

  _addNotification(notification) {
    notification.timeout = setTimeout(
      () => this._removeNotification(notification.id),
      this.props.notificationTimeout
    );
    this.setState({ notifications: this.state.notifications.concat([notification]) });
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
