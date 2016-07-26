import { PropTypes } from 'react'
import Schema from './Schema'

const ConferenceRoomSchema = {
  id:       PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title:    PropTypes.string.isRequired,
  color:    PropTypes.string,
  capacity: PropTypes.number
};

export default Schema(ConferenceRoomSchema);
