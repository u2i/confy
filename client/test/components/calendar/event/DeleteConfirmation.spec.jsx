import React from 'react';
import { Modal } from 'react-bootstrap';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import EventFactory from 'test/factories/Event';
import DeleteConfirmation from 'components/calendar/event/DeleteConfirmation';

describe('<DeleteConfirmation />', () => {
  const onHideSpy = sinon.spy();
  const onCancelSpy = sinon.spy();
  const onConfirmSpy = sinon.spy();
  const event = EventFactory.build();

  const props = {
    event,
    show: true,
    onHide: onHideSpy,
    onCancel: onCancelSpy,
    onConfirm: onConfirmSpy
  };

  it('renders <Modal />', () => {
    const wrapper = shallow(<DeleteConfirmation {...props} />);
    expect(wrapper.find(Modal)).to.exist();
  });

  it('invokes cancelHandler on Cancel button press', () => {
    const wrapper = shallow(<DeleteConfirmation {...props} />);
    wrapper.find('Button.cancel-delete').simulate('click');
    expect(onCancelSpy).to.be.calledOnce();
  });

  it('invokes confirmHandler on Delete button press', () => {
    const wrapper = shallow(<DeleteConfirmation {...props} />);
    wrapper.find('Button.confirm-delete').simulate('click');
    expect(onConfirmSpy).to.be.calledOnce();
  });
});
