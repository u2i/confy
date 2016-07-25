import { PropTypes } from 'react'

import ConferenceRoomSchema from './ConferenceRoomSchema'

const EventShape = {
  id:         PropTypes.string.isRequired,
  name:       PropTypes.string.isRequired,
  user:       PropTypes.string.isRequired,
  start_time: PropTypes.Date.isRequired,
  end_time:   PropTypes.Date.isRequired,
  conference_room: ConferenceRoomSchema.isRequired
};

export default PropTypes.shape(EventShape);