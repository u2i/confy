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

    this.state = { events: this.props.initialEvents, updating: false };
    this.handleCalendarRefresh = this.handleCalendarRefresh.bind(this);
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
          <SideNav onRefresh={this.handleCalendarRefresh} updating={this.state.updating} />
        </Col>
        <Col xs={12} md={10}>
          <Calendar {...calendarProps} events={this.state.events} />
        </Col>
      </Grid>
    );
  }

  _fetchEvents() {
    this.setState({ updating: true });
    EventSource
      .fetch({ date: this.props.date })
      .then(({ data }) => {
        this.setState({ events: data, updating: false });
      })
      .catch(() =>
        this.setState({ updating: false })
      );
  }
}
