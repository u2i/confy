import React from 'react';
import { If, Then, Else } from 'react-if';
import EventSchema from 'proptypes/schemas/EventSchema';
import { Grid, Row, Col, Jumbotron } from 'react-bootstrap';
import { DATE_DISPLAY_FORMAT } from 'helpers/DateHelper';

import Clock from './time/Clock';
import CurrentEvent from './event/CurrentEvent';
import NextEvent from './event/NextEvent';

import './conference_room.scss';

const ConferenceRoomContainer = ({ current_event, next_event, conference_room }) => (
  <Grid>
    <Row style={{ backgroundColor: conference_room.color }} className="room-header">
      <Col xs={6}>
        <h1>{conference_room.title}</h1>
      </Col>
      <Col xs={6}>
        <h3 className="pull-right"><Clock format={DATE_DISPLAY_FORMAT}/></h3>
      </Col>
    </Row>
    <If condition={!!current_event || !!next_event}>
      <Then>
        <Row>
          <Col xs={12} sm={8}>
            <CurrentEvent event={current_event}/>
          </Col>
          <Col xs={12} sm={4}>
            <NextEvent event={next_event}/>
          </Col>
        </Row>
      </Then>
      <Else>
        <Col xs={12}>
          There are no more events for today
        </Col>
      </Else>
    </If>
  </Grid>
);

ConferenceRoomContainer.propTypes = {
  current_event: EventSchema.except('width', 'offset'),
  next_event: EventSchema.except('width', 'offset')
};

export default ConferenceRoomContainer;
