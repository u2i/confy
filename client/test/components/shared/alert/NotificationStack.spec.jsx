import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import NotificationFactory from 'test/factories/Notification';

import NotificationStack from 'components/shared/alert/NotificationStack';
import Notification from 'components/shared/alert/Notification';

describe('<NotificationStack />', () => {
  const onDismiss = sinon.spy();

  afterEach(() => {
    onDismiss.reset();
  });

  it('renders <Notification /> for all notifications', () => {
    const notifications = NotificationFactory.buildList(3);
    const wrapper = shallow(<NotificationStack notifications={notifications} onDismiss={onDismiss}/>);
    expect(wrapper).to.have.exactly(notifications.length).descendants(Notification);
  });

  it('invokes callback with notification id when notification is dismissed', () => {
    const notification = NotificationFactory.build();
    const notifications = [notification];
    const wrapper = shallow(<NotificationStack notifications={notifications} onDismiss={onDismiss}/>);

    wrapper.find(Notification).simulate('dismiss');

    expect(onDismiss).to.have.been.calledWith(notification.id)
  });
});
