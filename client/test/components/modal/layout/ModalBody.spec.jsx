import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import ModalBody from 'components/modal/layout/ModalBody';
import FormLocationField from 'components/modal/layout/body/FormLocationField';
import ConferenceRoom from 'test/factories/ConferenceRoom';

describe('<ModalBody />', () => {
  const updateSpy = sinon.spy();
  const rooms = [
    ConferenceRoom.build(),
    ConferenceRoom.build()
  ];

  const wrapper = mount(<ModalBody
    updateParam={updateSpy}
    availableLocations={rooms}
    unavailableLocations={[]} />);

  it('renders a form for creating event', () => {
    const wrapperShallow = shallow(<ModalBody
      updateParam={updateSpy}
      availableLocations={rooms}
      unavailableLocations={[]} />);
    expect(wrapperShallow.find('form')).to.exist;
  });

  it('renders Summary text field', () => {
    expect(wrapper.find('FormTextField[name="summary"]')).to.exist;
  });

  it('renders Description text field', () => {
    expect(wrapper.find('FormTextField[name="description"]')).to.exist;
  });

  it('renders Start time date field', () => {
    expect(wrapper.find('FormDateField[label="Start time"]')).to.exist;
  });

  it('renders End time date field', () => {
    expect(wrapper.find('FormDateField[label="End time"]')).to.exist;
  });

  it('renders Location select field', () => {
    expect(wrapper.find(FormLocationField)).to.exist;
  });
});
