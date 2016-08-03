import { PropTypes } from 'react';

const ConferenceRoomSchema = {
  id:       PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title:    PropTypes.string.isRequired,
  color:    PropTypes.string,
  capacity: PropTypes.number
};

export default schema(ConferenceRoomSchema);
