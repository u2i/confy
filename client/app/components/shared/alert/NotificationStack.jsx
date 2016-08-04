import React from 'react';

import Notification from './Notification';

import './notification_stack.scss';

const { string, func, shape, arrayOf } = React.PropTypes;

const NotificationStack = ({ notifications, onDismiss, ...alertProps }) => (
  <div className="notification-stack">
    {notifications.map(notification => (
      <Notification type={notification.type}
                    onDismiss={() => onDismiss(notification.id)}
        {...alertProps}
                    key={notification.id}>
        {notification.text}
      </Notification>
    ))}
  </div>
);

NotificationStack.propTypes = {
  notifications: arrayOf(shape({ id: string, type: string })).isRequired,
  onDismiss: func.isRequired
};


export default NotificationStack;
