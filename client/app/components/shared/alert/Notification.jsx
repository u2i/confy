import React from 'react';
import { Alert } from 'react-bootstrap';

const Notification = ({ type, children, ...alertProps }) => (
  <Alert bsStyle={type} {...alertProps}>
    {children}
  </Alert>
);

Notification.propTypes = {
  type: React.PropTypes.oneOf(['success', 'danger', 'info', 'warning']),
  children: React.PropTypes.string.isRequired
};

export default Notification;
