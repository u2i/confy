import React from 'react';
import { Grid, Col } from 'react-bootstrap';
import _ from 'lodash';
import EventSource from 'sources/EventSource';
import moment from 'moment';

import Calendar from './calendar/Calendar';
import SideNav from './layout/SideNav';
import CreateEventModal from './modal/CreateEventModal';
import ConferenceRoomSchema from 'schemas/ConferenceRoomSchema';

export default class AppContainer extends React.Component {
  static propTypes = {
    initialEvents:   React.PropTypes.array,
    date:            React.PropTypes.string,
    conferenceRooms: React.PropTypes.arrayOf(ConferenceRoomSchema)
  };

  static defaultProps = {
    date: moment().format('YYYY-MM-DD')
  };

  constructor(...args) {
    super(...args);

    this.state = {
      events:    this.props.initialEvents,
      updating:  false,
      showModal: false
    };

    _.bindAll(this, ['openModal', 'closeModal', 'handleCalendarRefresh']);
  }

  componentDidMount() {
    if (!this.state.events) {
      this._fetchEvents();
    }
  }

  handleCalendarRefresh() {
    this._fetchEvents();
  }


  openModal() {
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  render() {
    const { initialEvents: _, ...calendarProps } = this.props;
    return (
      <Grid>
        <Col xs={12} md={2}>
          <SideNav onRefresh={this.handleCalendarRefresh}
                   date={this.props.date}
                   updating={this.state.updating}
                   openModal={this.openModal} />
        </Col>
        <Col xs={12} md={10}>
          <Calendar {...calendarProps} events={this.state.events} />
        </Col>
        <CreateEventModal closeModal={this.closeModal}
                          showModal={this.state.showModal}
                          conferenceRooms={this.props.conferenceRooms}
                          refresh={this.handleCalendarRefresh} />
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
