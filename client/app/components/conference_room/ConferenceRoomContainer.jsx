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

const nextEventStart = (nextEvents) => moment(get(nextEvents[0], 'start.date_time'));

const ConferenceRoomContainer = ({
  currentEvent,
  nextEvents,
  conferenceRoom,
  onUpdate,
  onConfirm,
  onFinish,
  onCreate,
  onCancel
}) => (
  <div>
    <Navbar conferenceRoom={conferenceRoom} />
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
          onCancel={onCancel}/> :
        <NoEvents onCreate={onCreate}/>
      }
    </Grid>
  </div>
);

ConferenceRoomContainer.propTypes = {
  currentEvent: EventSchema.except('width', 'offset'),
  nextEvents: React.PropTypes.arrayOf(EventSchema.except('width', 'offset')),
  conferenceRoom: ConferenceRoomSchema.only('color').isRequired,
  onUpdate: React.PropTypes.func,
  onConfirm: React.PropTypes.func,
  onFinish: React.PropTypes.func,
  onCreate: React.PropTypes.func,
  onCancel: React.PropTypes.func
};

export default ConferenceRoomContainer;
