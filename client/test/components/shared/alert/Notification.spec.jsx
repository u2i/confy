import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';

import Notification from 'components/shared/alert/Notification';
import { Alert } from 'react-bootstrap';

describe('<Notification />', () => {
  it('renders its children', () => {
    const text = 'text';
    const wrapper = mount(<Notification>{text}</Notification>);
    expect(wrapper).to.have.text(text);
  });

  it('renders an <Alert />', () => {
    const wrapper = shallow(<Notification />);
    expect(wrapper).to.have.exactly(1).descendants(Alert);
  });

  it('sets style based on type', () => {
    const wrapper = mount(<Notification type="danger" />);
    expect(wrapper.find('.alert')).to.have.className('alert-danger');
  });
});
