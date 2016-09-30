import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RoomAvailabilityStatus from 'components/conference_room/availability/RoomAvailabilityStatus';
import { AVAILABILITY } from 'helpers/AvailabilityHelper';
import moment from 'moment';
import ConferenceRoom from 'test/factories/ConferenceRoom';

describe('<RoomAvailabilityStatus />', () => {
  const { ALL_DAY_AVAILABLE, CURRENTLY_AVAILABLE, CURRENTLY_BUSY } = AVAILABILITY;
  const buildWrapper = props => shallow(<RoomAvailabilityStatus {...props} />);
  const conferenceRoom = ConferenceRoom.build();

  context('given all day available props', () => {
    const allDayAvailableProps = { availability: ALL_DAY_AVAILABLE, conferenceRoom };
    const wrapper = buildWrapper(allDayAvailableProps);

    it('renders .available component', () => {
      expect(wrapper.find('.available')).to.exist();
    });
  });

  context('given currently available props', () => {
    const duration = moment.duration(1, 'minutes');
    const currentlyAvailableProps = { availability: CURRENTLY_AVAILABLE, duration, conferenceRoom };
    const wrapper = buildWrapper(currentlyAvailableProps);

    it('renders .available component', () => {
      expect(wrapper.find('.available')).to.exist();
    });

    it('renders availability duration status', () => {
      expect(wrapper.find('p').text()).to.contain('available for 00:01');
    });
  });

  context('given currently busy props', () => {
    const duration = moment.duration(1, 'minutes');
    const currentlyBusyProps = { availability: CURRENTLY_BUSY, duration, conferenceRoom };
    const wrapper = buildWrapper(currentlyBusyProps);

    it('renders .available component', () => {
      expect(wrapper.find('.unavailable')).to.exist();
    });

    it('renders availability duration status', () => {
      expect(wrapper.find('p').text()).to.contain('available in 00:01');
    });
  });
});
