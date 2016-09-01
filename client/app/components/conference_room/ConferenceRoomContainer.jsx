import get from 'lodash/get';
import React from 'react';
import { If, Then, Else } from 'react-if';
import EventSchema from 'proptypes/schemas/EventSchema';
import ConferenceRoomSchema from 'proptypes/schemas/ConferenceRoomSchema';
import { Grid, Row, Col, Jumbotron } from 'react-bootstrap';
import { DATE_DISPLAY_FORMAT } from 'helpers/DateHelper';

import Clock from './time/Clock';
import CurrentEvent from './event/CurrentEvent';
import NextEvent from './event/NextEvent';

import './conference_room.scss';

const ConferenceRoomContainer = ({
  currentEvent,
  nextEvent,
  conferenceRoom,
  onCompleted,
  quote
}) => (
  <Grid className="conference-room-container">
    <Row style={{ backgroundColor: conferenceRoom.color }} className="room-header">
      <Col xs={6}>
        <h1>{conferenceRoom.title}</h1>
      </Col>
      <Col xs={6}>
        <h3 className="pull-right"><Clock format={DATE_DISPLAY_FORMAT}/></h3>
      </Col>
    </Row>
    <If condition={!!currentEvent || !!nextEvent}>
      <Then>
        <Row>
          <Col xs={12} sm={8}>
            <CurrentEvent event={currentEvent}
                          nextEventStart={get(nextEvent, 'start.date_time')}
                          onCompleted={onCompleted}/>
          </Col>
          <Col xs={12} sm={4}>
            <NextEvent event={nextEvent}/>
          </Col>
        </Row>
      </Then>
      <Else>
        <Col xs={12}>
          <Jumbotron>
            <h3>There are no more events for today</h3>
            <p>Check back tomorrow!</p>
          </Jumbotron>
        </Col>
      </Else>
    </If>
  </Grid>
);

ConferenceRoomContainer.propTypes = {
  currentEvent: EventSchema.except('width', 'offset'),
  nextEvent: EventSchema.except('width', 'offset'),
  conferenceRoom: ConferenceRoomSchema.only('color').isRequired,
  quote: React.PropTypes.shape({
    quote: React.PropTypes.string,
    author: React.PropTypes.string
  })
};

export default ConferenceRoomContainer;
