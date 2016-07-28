import React from 'react'
import Calendar from './calendar/Calendar'
import SideNav from './SideNav'
import CreateEventModal from './CreateEventModal'

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
      <div className="container">
        <div className="col-xs-12 col-md-10">
          <SideNav
            openModal={this.openModal}
          />
          <Calendar {...this.props} />
        </div>
        <CreateEventModal
          showModal={this.state.showModal}
          closeModal={this.closeModal}
          conferenceRooms={this.props.conferenceRooms}
        />
      </div>
    )
  }
}
