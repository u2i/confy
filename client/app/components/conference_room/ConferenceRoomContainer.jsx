import moment from 'moment';
import get from 'lodash/get';
import React from 'react';
import { If, Then, Else } from 'react-if';
import EventSchema from 'proptypes/schemas/EventSchema';
import ConferenceRoomSchema from 'proptypes/schemas/ConferenceRoomSchema';
import { Grid, Row, Col, Jumbotron } from 'react-bootstrap';
import { DATE_DISPLAY_FORMAT } from 'helpers/DateHelper';

import Navbar from './layout/Navbar';
import CurrentEvent from './event/CurrentEvent';
import NextEvent from './event/NextEvent';

import './conference_room.scss';

const ConferenceRoomContainer = ({
  currentEvent,
  nextEvent,
  conferenceRoom,
  onUpdate
}) => (
  <div>
    <Navbar conferenceRoom={conferenceRoom} />
    <Grid className="conference-room-container">
      <If condition={!!currentEvent || !!nextEvent}>
        <Then>
          <Row>
            <Col xs={12} sm={8}>
              <CurrentEvent event={currentEvent}
                            nextEventStart={moment(get(nextEvent, 'start.date_time'))}
                            onCompleted={onUpdate} />
            </Col>
            <Col xs={12} sm={4}>
              <NextEvent event={nextEvent} />
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
  </div>
);

ConferenceRoomContainer.propTypes = {
  currentEvent: EventSchema.except('width', 'offset'),
  nextEvent: EventSchema.except('width', 'offset'),
  conferenceRoom: ConferenceRoomSchema.only('color').isRequired,
  onUpdate: React.PropTypes.func
};

export default ConferenceRoomContainer;
