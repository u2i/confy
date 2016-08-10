import { PropTypes } from 'react';
import moment from '../moment';
import schema from './Schema';

import UserSchema from './UserSchema';
import ConferenceRoomSchema from './ConferenceRoomSchema';

const { string, number, shape, oneOfType } = PropTypes;

const time = shape({
  date_time: moment.isRequired
});

const EventShema = {
  id:              oneOfType([string, number]).isRequired,
  creator:         UserSchema.isRequired,
  start:           time.isRequired,
  end:             time.isRequired,
  conference_room: ConferenceRoomSchema.isRequired,
  name:            string,
  summary:         string,
  start_timestamp: number,
  end_timestamp:   number
};

export default schema(EventShema);
