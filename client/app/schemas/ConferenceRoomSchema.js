import { PropTypes } from 'react'

const ConferenceRoomSchema = {
  _id:      PropTypes.string.isRequired,
  title:    PropTypes.string.isRequired,
  color:    PropTypes.string,
  capacity: PropTypes.number
};

export default PropTypes.shape(ConferenceRoomSchema);