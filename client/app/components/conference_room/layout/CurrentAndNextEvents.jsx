import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import { Row, Col, Accordion, Panel } from 'react-bootstrap';
import EventSchema from 'proptypes/schemas/EventSchema';
import texts from '../texts/texts';

import CurrentEvent from '../event/CurrentEvent';
import NextEvents from '../event/NextEvents';
import RoomsAvailability from 'components/conference_room/availability/RoomsAvailability';

import './current_next_events.scss';

const CurrentAndNextEvents = ({
  currentEvent,
  nextEvents,
  nextEventStart,
  onUpdate,
  onConfirm,
  onFinish,
  onCreate,
  onCancel,
  conferenceRoom,
  allEvents
}) => (
  <Row>
    <Col xs={12} sm={8}>
      <CurrentEvent event={currentEvent}
                    nextEventStart={nextEventStart}
                    onCompleted={onUpdate}
                    onConfirm={onConfirm}
                    onFinish={onFinish}
                    onCreate={onCreate}
                    onCancel={onCancel} />
    </Col>
    <Col xs={12} sm={4}>
      <Accordion className="side-accordion" defaultActiveKey="1">
        <Panel header="Next events" eventKey="1">
          <NextEvents events={nextEvents} noEventLabel={texts.NO_MORE_EVENTS} />
        </Panel>
        <Panel header="Available rooms" eventKey="2">
          <RoomsAvailability conferenceRoom={conferenceRoom} events={allEvents} />
        </Panel>
      </Accordion>
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
  onCancel: React.PropTypes.func
};

export default CurrentAndNextEvents;
