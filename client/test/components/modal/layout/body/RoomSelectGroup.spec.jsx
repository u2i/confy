import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import { ControlLabel, FormControl } from 'react-bootstrap';
import RoomSelectGroup from 'components/modal/layout/body/RoomSelectGroup';
import ConferenceRoom from 'test/factories/ConferenceRoom';

describe('<RoomSelectGroup />', () => {
  const defaultRooms = [
    ConferenceRoom.build(),
    ConferenceRoom.build()
  ];
  const defaultLabel = 'Available';

  const shallowWrapper = ({ rooms = defaultRooms } = {}) =>
    shallow(<RoomSelectGroup rooms={rooms} label={defaultLabel} />);
  const mountWrapper = ({ rooms = defaultRooms, selected } = {}) =>
    mount(<RoomSelectGroup rooms={rooms} label={defaultLabel} selected={selected} />);
  const defaultWrapper = mountWrapper();

  context('with non-empty room list', () => {
    it('renders one <optgroup /> with label', () => {
      expect(defaultWrapper).to.have.exactly(1).descendants('optgroup');
      expect(defaultWrapper.find('optgroup')).to.have.attr('label').equal(defaultLabel);
    });
  });

  context('with empty room list', () => {
    it('should not render <optgroup />', () => {
      const wrapper = mountWrapper({ rooms: [] });
      expect(wrapper).to.not.have.descendants('optgroup');
    });
  });

  it('renders select option for every room', () => {
    const wrapper = shallowWrapper();
    expect(wrapper).to.have.exactly(defaultRooms.length).descendants('option');
  });
});
