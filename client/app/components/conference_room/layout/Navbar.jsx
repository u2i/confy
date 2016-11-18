import React from 'react';
import { Navbar } from 'react-bootstrap';
import ConferenceRoomSchema from 'schemas/ConferenceRoomSchema';

import Clock from 'components/shared/time/Clock';
import Help from '../help/HelpContainer';

import './navbar.scss';

const RoomNavbar = ({ activeConferenceRoom }) => (
  <Navbar className="conference-room-navbar">
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#"><h2 className={activeConferenceRoom.logo}>{activeConferenceRoom.title}</h2></a>
      </Navbar.Brand>
      <Navbar.Form pullRight>
        <Help />
      </Navbar.Form>
      <div className="navbar-text pull-right"><h3><Clock dateFormat="MM-DD dddd" timeFormat="HH:mm" /></h3></div>
    </Navbar.Header>
  </Navbar>
);

RoomNavbar.propTypes = {
  activeConferenceRoom: ConferenceRoomSchema.only('title', 'logo').isRequired
};

export default RoomNavbar;
