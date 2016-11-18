import { PropTypes } from 'react';
import schema from './Schema';

const ConferenceRoomSchema = {
  id:       PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title:    PropTypes.string.isRequired,
  color:    PropTypes.string,
  capacity: PropTypes.number,
  kind:     PropTypes.string,
  logo:     PropTypes.string
};

export default schema(ConferenceRoomSchema);
