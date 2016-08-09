import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { ControlLabel, FormControl } from 'react-bootstrap';
import FormLocationField from 'components/modal/layout/body/FormLocationField';
import ConferenceRoom from 'test/factories/ConferenceRoom';

describe('<FormLocationField />', () => {
  const onChangeSpy = sinon.spy();
  const rooms = [
    ConferenceRoom.build(),
    ConferenceRoom.build()
  ];

  it('renders <ControlLabel />', () => {
    const wrapper =
      shallow(<FormLocationField
                  conferenceRooms={rooms}
                  onChange={onChangeSpy} />);
    expect(wrapper.find(ControlLabel)).to.exist;
  });

  it('renders <ControlLabel /> with "Location:" text', () => {
    const wrapper =
      mount(<FormLocationField
        conferenceRooms={rooms}
        onChange={onChangeSpy} />);
    expect(wrapper.find(ControlLabel)).to.have.text('Location:');
  });

  it('renders <FormControl />', () => {
    const wrapper =
      shallow(<FormLocationField
        conferenceRooms={rooms}
        onChange={onChangeSpy} />);
    expect(wrapper.find(FormControl)).to.exist;
  });

  it('renders select option for every room', () => {
    const wrapper =
      mount(<FormLocationField
        conferenceRooms={rooms}
        onChange={onChangeSpy} />);
    expect(wrapper.find('option')).to.have.lengthOf(rooms.length);
  });

  it('invokes onChange handler after location change', () => {
    const wrapper =
      mount(<FormLocationField
        conferenceRooms={rooms}
        onChange={onChangeSpy} />);
    wrapper.find('select').simulate('change', { target: { value: rooms[1].id } });
    expect(onChangeSpy).to.be.calledOnce();
  });
});
