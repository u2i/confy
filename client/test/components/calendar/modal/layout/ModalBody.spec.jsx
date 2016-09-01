import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import ModalBody from 'components/calendar/modal/layout/ModalBody';
import FormLocationField from 'components/calendar/modal/layout/body/FormLocationField';
import ConferenceRoom from 'test/factories/ConferenceRoom';
import GuestsField from 'components/calendar/modal/layout/body/GuestsField';

describe('<ModalBody />', () => {
  const updateSpy = sinon.spy();
  const rooms = [
    ConferenceRoom.build(),
    ConferenceRoom.build()
  ];

  const wrapper = mount(<ModalBody
    updateParam={updateSpy}
    availableLocations={rooms}
    unavailableLocations={[]}
    onError={sinon.spy()} />);

  it('renders a form for creating event', () => {
    const wrapperShallow = shallow(<ModalBody
      updateParam={updateSpy}
      availableLocations={rooms}
      unavailableLocations={[]}
      onError={sinon.spy()} />);
    expect(wrapperShallow.find('form')).to.exist();
  });

  it('renders Summary text field', () => {
    expect(wrapper.find({ name: 'summary' })).to.exist();
  });

  it('renders Description text field', () => {
    expect(wrapper.find({ name: 'description' })).to.exist();
  });

  it('renders two date fields', () => {
    expect(wrapper.find('FormDateField')).to.have.lengthOf(2);
  });

  it('renders Location select field', () => {
    expect(wrapper.find(FormLocationField)).to.exist();
  });

  it('renders <GuestsField />', () => {
    expect(wrapper.find(GuestsField)).to.exist();
  });
});
