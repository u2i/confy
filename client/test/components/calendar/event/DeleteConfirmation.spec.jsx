import React from 'react';
import { Modal } from 'react-bootstrap';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import EventFactory from 'test/factories/Event';
import DeleteConfirmation from 'components/calendar/event/DeleteConfirmation';

describe('<DeleteConfirmation />', () => {
  const onHideSpy = sinon.spy();
  const cancelHandlerSpy = sinon.spy();
  const confirmHandlerSpy = sinon.spy();
  const event = EventFactory.build();

  const props = {
    show: true,
    onHide: onHideSpy,
    cancelHandler: cancelHandlerSpy,
    confirmHandler: confirmHandlerSpy,
    event: event
  };

  it('renders <Modal />', () => {
    const wrapper = shallow(<DeleteConfirmation  {...props} />);
    expect(wrapper.find(Modal)).to.exist();
  });

  it('invokes cancelHandler on Cancel button press', () => {
    const wrapper = shallow(<DeleteConfirmation {...props} />);
    wrapper.find('Button.cancel-delete').simulate('click');
    expect(cancelHandlerSpy).to.be.calledOnce();
  });

  it('invokes confirmHandler on Delete button press', () => {
    const wrapper = shallow(<DeleteConfirmation {...props} />);
    wrapper.find('Button.confirm-delete').simulate('click');
    expect(confirmHandlerSpy).to.be.calledOnce();
  });

  it('renders event\'s summary', () => {
    const wrapper = shallow(<DeleteConfirmation {...props} />);
    console.log(wrapper.debug());
    expect(wrapper.find('.summary')).to.have.text(event.summary);
  })
});
