import moment from 'moment';
import get from 'lodash/get';
import React from 'react';
import EventSchema from 'proptypes/schemas/EventSchema';
import ConferenceRoomSchema from 'proptypes/schemas/ConferenceRoomSchema';
import { Grid, Row, Col, Jumbotron } from 'react-bootstrap';

import Navbar from './layout/Navbar';
import CurrentEvent from './event/CurrentEvent';
import NextEvents from './event/NextEvents';

import './conference_room.scss';

const NO_MORE_EVENTS_TEXT = 'No more events for today';

const CurrentAndNextEvents = ({ currentEvent, nextEvents, onUpdate }) => (
  <Row>
    <Col xs={12} sm={8}>
      <CurrentEvent event={currentEvent}
                    nextEventStart={moment(get(nextEvents[0], 'start.date_time'))}
                    onCompleted={onUpdate} />
    </Col>
    <Col xs={12} sm={4}>
      <NextEvents events={nextEvents} noEventLabel={NO_MORE_EVENTS_TEXT} />
    </Col>
  </Row>
);

CurrentAndNextEvents.propTypes = {
  currentEvent: EventSchema.except('width', 'offset'),
  nextEvents: React.PropTypes.arrayOf(EventSchema.only('start')),
  onUpdate: React.PropTypes.func
};

const NoEvents = () => (
  <Row>
    <Col xs={12}>
      <Jumbotron>
        <h3>{NO_MORE_EVENTS_TEXT}</h3>
        <p>Check back tomorrow!</p>
      </Jumbotron>
    </Col>
  </Row>
);

const ConferenceRoomContainer = ({
  currentEvent,
  nextEvents,
  conferenceRoom,
  onUpdate
}) => (
  <div>
    <Navbar conferenceRoom={conferenceRoom} />
    <Grid className="conference-room-container">
      {currentEvent || nextEvents.length > 0 ?
        <CurrentAndNextEvents currentEvent={currentEvent} nextEvents={nextEvents} onUpdate={onUpdate} /> :
        <NoEvents />
      }
    </Grid>
  </div>
);

ConferenceRoomContainer.propTypes = {
  currentEvent: EventSchema.except('width', 'offset'),
  nextEvents: React.PropTypes.arrayOf(EventSchema.except('width', 'offset')),
  conferenceRoom: ConferenceRoomSchema.only('color').isRequired,
  onUpdate: React.PropTypes.func
};

export default ConferenceRoomContainer;
