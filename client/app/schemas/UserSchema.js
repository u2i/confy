import { PropTypes } from 'react';
import schema from './Schema';

const UserSchema = {
  email:        PropTypes.string.isRequired,
  display_name: PropTypes.string
};

export default schema(UserSchema);

