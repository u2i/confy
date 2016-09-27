import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import { Row, Col } from 'react-bootstrap';
import EventSchema from 'proptypes/schemas/EventSchema';
import texts from '../texts/texts';

import CurrentEvent from '../event/CurrentEvent';
import NextEvents from '../event/NextEvents';

const CurrentAndNextEvents = ({
  currentEvent,
  nextEvents,
  nextEventStart,
  onUpdate,
  onConfirm,
  onFinish,
  onCreate,
  onCancel,
  onExtend
}) => (
  <Row>
    <Col xs={12} sm={8}>
      <CurrentEvent event={currentEvent}
                    nextEventStart={nextEventStart}
                    onCompleted={onUpdate}
                    onConfirm={onConfirm}
                    onFinish={onFinish}
                    onCreate={onCreate}
                    onCancel={onCancel}
                    onExtend={onExtend} />
    </Col>
    <Col xs={12} sm={4}>
      <NextEvents events={nextEvents} noEventLabel={texts.NO_MORE_EVENTS} />
    </Col>
  </Row>
);

CurrentAndNextEvents.propTypes = {
  currentEvent: EventSchema.except('width', 'offset'),
  nextEvents: React.PropTypes.arrayOf(EventSchema.only('start')),
  nextEventStart: instanceOfMoment,
  onUpdate: React.PropTypes.func,
  onConfirm: React.PropTypes.func,
  onFinish: React.PropTypes.func,
  onCreate: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onExtend: React.PropTypes.func
};

export default CurrentAndNextEvents;
