import moment from 'moment';
import get from 'lodash/get';
import React from 'react';
import { Row, Col } from 'react-bootstrap';
import EventSchema from 'proptypes/schemas/EventSchema';
import texts from '../texts/texts';

import CurrentEvent from '../event/CurrentEvent';
import NextEvents from '../event/NextEvents';

const CurrentAndNextEvents = ({ currentEvent, nextEvents, onUpdate, onConfirm, onFinish, onCancel }) => (
  <Row>
    <Col xs={12} sm={8}>
      <CurrentEvent event={currentEvent}
                    nextEventStart={moment(get(nextEvents[0], 'start.date_time'))}
                    onCompleted={onUpdate}
                    onConfirm={onConfirm}
                    onFinish={onFinish}
                    onCancel={onCancel} />
    </Col>
    <Col xs={12} sm={4}>
      <NextEvents events={nextEvents} noEventLabel={texts.NO_MORE_EVENTS} />
    </Col>
  </Row>
);

CurrentAndNextEvents.propTypes = {
  currentEvent: EventSchema.except('width', 'offset'),
  nextEvents: React.PropTypes.arrayOf(EventSchema.only('start')),
  onUpdate: React.PropTypes.func,
  onConfirm: React.PropTypes.func,
  onFinish: React.PropTypes.func,
  onCancel: React.PropTypes.func
};

export default CurrentAndNextEvents;
