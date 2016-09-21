import React from 'react';
import { ControlLabel } from 'react-bootstrap';

const RequiredFieldLabel = ({ label, required }) => (
  <ControlLabel>
    {label}:{required ? '*' : ''}
  </ControlLabel>
);

RequiredFieldLabel.propTypes = {
  label: React.PropTypes.string.isRequired,
  required: React.PropTypes.bool
};

export default RequiredFieldLabel;
