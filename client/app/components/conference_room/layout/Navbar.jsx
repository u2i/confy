import React from 'react';
import { Navbar } from 'react-bootstrap';
import ConferenceRoomSchema from 'schemas/ConferenceRoomSchema';

import Clock from 'components/shared/time/Clock';

import './navbar.scss';

const RoomNavbar = ({ conferenceRoom }) => (
  <Navbar style={{ backgroundColor: conferenceRoom.color }} className="conference-room-navbar">
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#"><h2>{conferenceRoom.title}</h2></a>
      </Navbar.Brand>
      <div className="navbar-text pull-right"><h3><Clock dateFormat="MM-DD dddd" timeFormat="HH:mm" /></h3></div>
    </Navbar.Header>
  </Navbar>
);

RoomNavbar.propTypes = {
  conferenceRoom: ConferenceRoomSchema.only('color', 'title').isRequired
};

export default RoomNavbar;
