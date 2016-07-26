import { PropTypes } from 'react';
import schema from './Schema';

import UserSchema from './UserSchema';
import ConferenceRoomSchema from './ConferenceRoomSchema';

const { string, number, shape, oneOfType, instanceOf } = PropTypes;

const time = shape({
  date_time: oneOfType([
    instanceOf(Date),
    string
  ]).isRequired
});

const EventShema = {
  id:              oneOfType([string, number]).isRequired,
  creator:         UserSchema.isRequired,
  start:           time.isRequired,
  end:             time.isRequired,
  conference_room: ConferenceRoomSchema.isRequired,
  name:            string,
  summary:         string
};

export default schema(EventShema);
