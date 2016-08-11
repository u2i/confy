import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { ControlLabel, FormControl } from 'react-bootstrap';
import FormLocationField from 'components/modal/layout/body/FormLocationField';
import RoomSelectGroup from 'components/modal/layout/body/RoomSelectGroup';
import ConferenceRoom from 'test/factories/ConferenceRoom';

describe('<FormLocationField />', () => {
  const onChangeSpy = sinon.spy();
  const rooms = [
    ConferenceRoom.build(),
    ConferenceRoom.build()
  ];

  const formLocationField = (props = {}) => (
    <FormLocationField
      available={props.available || rooms}
      unavailable={props.unavailable || []}
      selected={props.selected}
      onChange={onChangeSpy} />
  );

  const shallowWrapper = (props) => shallow(formLocationField(props));
  const mountWrapper = (props) => mount(formLocationField(props));

  it('renders <ControlLabel />', () => {
    const wrapper = shallowWrapper();
    expect(wrapper.find(ControlLabel)).to.exist();
  });

  it('renders <ControlLabel /> with "Location:" text', () => {
    const wrapper = mountWrapper();
    expect(wrapper.find(ControlLabel)).to.have.text('Location:');
  });

  it('renders <FormControl />', () => {
    const wrapper = shallowWrapper();
    expect(wrapper.find(FormControl)).to.exist();
  });

  it('invokes onChange handler after location change', () => {
    const wrapper = mountWrapper();
    wrapper.find('select').simulate('change', { target: { value: rooms[1].id } });
    expect(onChangeSpy).to.be.calledOnce();
  });

  it('renders two <RoomSelectGroup />', () => {
    const wrapper = shallowWrapper();
    expect(wrapper).to.have.exactly(2).descendants(RoomSelectGroup);
  });
});
