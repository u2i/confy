import moment from 'moment';
import get from 'lodash/get';
import React from 'react';
import EventSchema from 'proptypes/schemas/EventSchema';
import ConferenceRoomSchema from 'proptypes/schemas/ConferenceRoomSchema';
import { Grid } from 'react-bootstrap';

import Navbar from './layout/Navbar';
import CurrentAndNextEvents from './layout/CurrentAndNextEvents';
import NoEvents from './layout/NoEvents';

import './conference_room.scss';

const nextEventStart = (nextEvents) => {
  const startTime = get(nextEvents[0], 'start.date_time');
  return startTime ? moment(startTime) : undefined;
};

const ConferenceRoomContainer = ({
  currentEvent,
  nextEvents,
  allEvents,
  activeConferenceRoom,
  allConferenceRooms,
  onUpdate,
  onConfirm,
  onFinish,
  onCreate,
  onCancel,
  onExtend
}) => (
  <div className="tablet-view">
    <Navbar activeConferenceRoom={activeConferenceRoom} />
    <Grid className="conference-room-container">
      {currentEvent || nextEvents.length > 0 ?
        <CurrentAndNextEvents
          currentEvent={currentEvent}
          nextEvents={nextEvents}
          nextEventStart={nextEventStart(nextEvents)}
          onUpdate={onUpdate}
          onConfirm={onConfirm}
          onFinish={onFinish}
          onCreate={onCreate}
          onCancel={onCancel}
          activeConferenceRoom={activeConferenceRoom}
          allConferenceRooms={allConferenceRooms}
          allEvents={allEvents}
          onExtend={onExtend} /> :
        <NoEvents onCreate={onCreate} />
      }
    </Grid>
  </div>
);

ConferenceRoomContainer.propTypes = {
  currentEvent: EventSchema.except('width', 'offset'),
  nextEvents: React.PropTypes.arrayOf(EventSchema.except('width', 'offset')),
  allEvents: React.PropTypes.arrayOf(EventSchema.except('width', 'offset')),
  activeConferenceRoom: ConferenceRoomSchema,
  allConferenceRooms: React.PropTypes.arrayOf(ConferenceRoomSchema),
  onUpdate: React.PropTypes.func,
  onConfirm: React.PropTypes.func,
  onFinish: React.PropTypes.func,
  onCreate: React.PropTypes.func,
  onCancel: React.PropTypes.func,
  onExtend: React.PropTypes.func
};

export default ConferenceRoomContainer;
