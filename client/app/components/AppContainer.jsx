import React from 'react';
import { Grid, Col } from 'react-bootstrap';
import Calendar from './calendar/Calendar';
import SideNav from './layout/SideNav';
import CreateEventModal from './CreateEventModal';


export default class AppContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
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
    )
  }
}
