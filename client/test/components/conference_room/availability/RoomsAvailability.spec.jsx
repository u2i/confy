import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import proxyquire from 'proxyquire';
import * as AvailabilityHelper from 'helpers/AvailabilityHelper';
import ConferenceRoom from 'test/factories/ConferenceRoom';
import moment from 'moment';

describe('<RoomsAvailability />', () => {
  const { ALL_DAY_AVAILABLE, CURRENTLY_AVAILABLE, CURRENTLY_BUSY } = AvailabilityHelper.AVAILABILITY;
  const conferenceRoom = ConferenceRoom.build();
  const duration0 = moment.duration(0, 'minutes');
  const duration1 = moment.duration(1, 'minutes');
  const duration2 = moment.duration(2, 'minutes');
  const allDayAvailable = { availability: ALL_DAY_AVAILABLE, duration: duration0, conferenceRoom };
  const currentlyAvailableShort = { availability: CURRENTLY_AVAILABLE, duration: duration1, conferenceRoom };
  const currentlyAvailableLong = { availability: CURRENTLY_AVAILABLE, duration: duration2, conferenceRoom };
  const currentlyBusyShort = { availability: CURRENTLY_BUSY, duration: duration1, conferenceRoom };
  const currentlyBusyLong = { availability: CURRENTLY_BUSY, duration: duration2, conferenceRoom };
  const availabilityProps = [
    currentlyBusyShort,
    currentlyAvailableLong,
    allDayAvailable,
    currentlyAvailableShort,
    currentlyBusyLong
  ];
  const RoomsAvailability = proxyquire('../../../../app/components/conference_room/availability/RoomsAvailability', {
    '../../../helpers/AvailabilityHelper': {
      buildAvailabilityProps: (_winter, _summer) => availabilityProps
    }
  }).default;

  const wrapper = shallow(<RoomsAvailability />);
  it('renders <RoomAvailabilityStatus /> per props', () => {
    expect(wrapper.find('RoomAvailabilityStatus')).to.have.lengthOf(availabilityProps.length);
  });
});
