import React from 'react';
import moment from 'moment';
import { Grid, Col } from 'react-bootstrap';
import EventSource from 'sources/EventSource';

import Calendar from './calendar/Calendar';
import SideNav from './layout/SideNav';

export default class AppContainer extends React.Component {
  static propTypes = {
    initialEvents: React.PropTypes.array,
    date:          React.PropTypes.string
  };

  static defaultProps = {
    date: moment().format('YYYY-MM-DD')
  };

  constructor(...args) {
    super(...args);

    this.state = { events: this.props.initialEvents };
    this.handleCalendarRefresh = this.handleCalendarRefresh.bind(this);
    this._deleteEvent = this._deleteEvent.bind(this);
  }

  componentDidMount() {
    if (!this.state.events) {
      this._fetchEvents();
    }
  }

  handleCalendarRefresh() {
    this._fetchEvents();
  }

  render() {
    const { initialEvents, ...calendarProps } = this.props;
    return (
      <Grid>
        <Col xs={12} md={2}>
          <SideNav onRefresh={this.handleCalendarRefresh} />
        </Col>
        <Col xs={12} md={10}>
          <Calendar {...calendarProps} events={this.state.events} onDelete={this._deleteEvent} />
        </Col>
      </Grid>
    );
  }

  _fetchEvents() {
    EventSource.fetch({ date: this.props.date })
      .then(({ data }) =>
        this.setState({ events: data }));
  }

  _deleteEvent(id) {
    EventSource.remove(id);
    const events = this.state.events;
    for (let i = 0; i < events.length; i ++) {
      const row = events[i];
      const index = row.findIndex(event => event.id === id);
      if (index >= 0) {
        row.splice(index, 1);
        break;
      }
    }
    this.setState({ events });
  }
}
