import { PropTypes } from 'react';
import schema from './Schema';

import UserSchema from './UserSchema';
import ConferenceRoomSchema from './ConferenceRoomSchema';

const { string, number, shape, oneOfType, arrayOf } = PropTypes;

const time = shape({
  date_time: string.isRequired
});

const EventShema = {
  id:              oneOfType([string, number]).isRequired,
  creator:         UserSchema,
  start:           time.isRequired,
  end:             time.isRequired,
  conference_room: ConferenceRoomSchema.isRequired,
  width:           number.isRequired,
  offset:          number.isRequired,
  name:            string,
  summary:         string,
  description:     string,
  start_timestamp: number,
  end_timestamp:   number,
  attendees:       arrayOf(UserSchema),
  hangout_link:    string
};

export default schema(EventShema);
