import React from 'react';
import { Navbar, Nav, NavItem, Button } from 'react-bootstrap';
import ConferenceRoomSchema from 'schemas/ConferenceRoomSchema';
import { DATE_DISPLAY_FORMAT } from 'helpers/DateHelper';

import Clock from 'components/shared/time/Clock';
import Help from '../help/HelpContainer';

import './navbar.scss';

const RoomNavbar = ({ conferenceRoom }) => (
  <Navbar style={{ backgroundColor: conferenceRoom.color }} className="conference-room-navbar">
    <Navbar.Header>
      <Navbar.Brand>
        <a href="#"><h2>{conferenceRoom.title}</h2></a>
      </Navbar.Brand>
    </Navbar.Header>

    <Navbar.Form pullRight>
      <Help />
    </Navbar.Form>

    <Nav pullRight>
      <NavItem><Clock format={DATE_DISPLAY_FORMAT} /></NavItem>
    </Nav>
  </Navbar>
);

RoomNavbar.propTypes = {
  conferenceRoom: ConferenceRoomSchema.only('color', 'title').isRequired
};

export default RoomNavbar;
