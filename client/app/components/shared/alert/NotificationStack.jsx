import React  from 'react';
import { Alert } from 'react-bootstrap';

import Notification from './Notification';

import './notification_stack.scss';

const { string, func, shape, arrayOf } = React.PropTypes;

export default class NotificationStack extends React.Component {
  render() {
    const { notifications, onDismiss, ...alertProps } = this.props;
    return (
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
  }
}

NotificationStack.propTypes = {
  notifications: arrayOf(shape({ id: string, type: string })).isRequired,
  onDismiss: func.isRequired
};

export default NotificationStack;