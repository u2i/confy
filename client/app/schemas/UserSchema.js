import { PropTypes } from 'react'
import Schema from './Schema'

const UserSchema = {
  email:        PropTypes.string.isRequired,
  display_name: PropTypes.string
};

export default Schema(UserSchema);

