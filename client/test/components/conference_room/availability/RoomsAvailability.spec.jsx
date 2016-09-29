import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import proxyquire from 'proxyquire';
import * as AvailabilityHelper from 'helpers/AvailabilityHelper';

describe('<RoomsAvailability />', () => {
  const { ALL_DAY_AVAILABLE, CURRENTLY_AVAILABLE, CURRENTLY_BUSY } = AvailabilityHelper.AVAILABILITY;
  const allDayAvailable = { availability: ALL_DAY_AVAILABLE, duration: 0 };
  const currentlyAvailableShort = { availability: CURRENTLY_AVAILABLE, duration: 1 };
  const currentlyAvailableLong = { availability: CURRENTLY_AVAILABLE, duration: 2 };
  const currentlyBusyShort = { availability: CURRENTLY_BUSY, duration: 1 };
  const currentlyBusyLong = { availability: CURRENTLY_BUSY, duration: 2 };
  const availabilityProps = [
    currentlyBusyShort,
    currentlyAvailableLong,
    allDayAvailable,
    currentlyAvailableShort,
    currentlyBusyLong
  ];
  const RoomsAvailability = proxyquire('../../../../app/components/conference_room/availability/RoomsAvailability', {
    '../../../helpers/AvailabilityHelper': {
      buildAvailabilityProps: (a, b) => availabilityProps
    }
  }).default;

  const wrapper = shallow(<RoomsAvailability />);
  it('renders <RoomAvailabilityStatus /> per props', () => {
    expect(wrapper.find('RoomAvailabilityStatus')).to.have.lengthOf(availabilityProps.length);
  });
});
