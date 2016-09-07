import moment from 'moment';
import get from 'lodash/get';
import React from 'react';
import { If, Then, Else } from 'react-if';
import EventSchema from 'proptypes/schemas/EventSchema';
import ConferenceRoomSchema from 'proptypes/schemas/ConferenceRoomSchema';
import { Grid, Row, Col, Jumbotron } from 'react-bootstrap';
import { DATE_DISPLAY_FORMAT } from 'helpers/DateHelper';

import Clock from 'components/shared/time/Clock';
import CurrentEvent from './event/CurrentEvent';
import NextEvents from './event/NextEvents';

import './conference_room.scss';

const NO_MORE_EVENTS_TEXT = 'No more events for today';

const ConferenceRoomContainer = ({
  currentEvent,
  nextEvents,
  conferenceRoom,
  onUpdate
}) => (
  <Grid className="conference-room-container">
    <Row style={{ backgroundColor: conferenceRoom.color }} className="room-header">
      <Col xs={6}>
        <h1>{conferenceRoom.title}</h1>
      </Col>
      <Col xs={6}>
        <h3 className="pull-right"><Clock dateFormat="MM-DD dddd" timeFormat='HH:mm' /></h3>
      </Col>
    </Row>
    <If condition={!!currentEvent || nextEvents.length > 0}>
      <Then>
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
      </Then>
      <Else>
        <Col xs={12}>
          <Jumbotron>
            <h3>{NO_MORE_EVENTS_TEXT}</h3>
            <p>Check back tomorrow!</p>
          </Jumbotron>
        </Col>
      </Else>
    </If>
  </Grid>
);

ConferenceRoomContainer.propTypes = {
  currentEvent: EventSchema.except('width', 'offset'),
  nextEvents: React.PropTypes.arrayOf(EventSchema.except('width', 'offset')),
  conferenceRoom: ConferenceRoomSchema.only('color').isRequired,
  onUpdate: React.PropTypes.func
};

export default ConferenceRoomContainer;
