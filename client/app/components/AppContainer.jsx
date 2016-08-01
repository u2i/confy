import React, { PropTypes } from 'react';
import { Grid, Col } from 'react-bootstrap';
import Calendar from './calendar/Calendar';
import SideNav from './layout/SideNav';
import CreateEventModal from './CreateEventModal';
import _ from 'lodash';

const { array } = PropTypes;

export default class AppContainer extends React.Component {
  static propTypes = {
    conferenceRooms: array.isRequired
  };

  constructor() {
    super();
    this.state = {
      showModal: false
    };

    _.bindAll(this, ['openModal', 'closeModal']);
  }

  openModal() {
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div>
        <Grid>
          <Col xs={12} md={2}>
            <SideNav openModal={this.openModal} />
          </Col>
          <Col xs={12} md={10}>
            <Calendar {...this.props} />
          </Col>
        </Grid>
        <CreateEventModal
          showModal={this.state.showModal}
          closeModal={this.closeModal}
          conferenceRooms={this.props.conferenceRooms} />
      </div>
    );
  }
}
