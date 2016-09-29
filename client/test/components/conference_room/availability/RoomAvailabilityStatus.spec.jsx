import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RoomAvailabilityStatus from 'components/conference_room/availability/RoomAvailabilityStatus';
import * as AvailabilityHelper from 'helpers/AvailabilityHelper';
import moment from 'moment';

describe('<RoomAvailabilityStatus />', () => {
  const { ALL_DAY_AVAILABLE, CURRENTLY_AVAILABLE, CURRENTLY_BUSY } = AvailabilityHelper.AVAILABILITY;
  const buildWrapper = (props) => shallow(<RoomAvailabilityStatus {...props} />);
  const remainingTime = 'remainingTime';

  context('given all day available props', () => {
    const allDayAvailableProps = { availability: ALL_DAY_AVAILABLE, conferenceRoomTitle: '' };
    const wrapper = buildWrapper(allDayAvailableProps);

    it('renders .available component', () => {
      expect(wrapper.find('.available')).to.exist();
    });
  });

  context('given currently available props', () => {
    const duration = moment.duration(1, 'minutes');
    const currentlyAvailableProps = { availability: CURRENTLY_AVAILABLE, duration, conferenceRoomTitle: '' };
    const wrapper = buildWrapper(currentlyAvailableProps);

    it('renders .available component', () => {
      expect(wrapper.find('.available')).to.exist();
    });

    it('renders availability duration status', () => {
      expect(wrapper.find('p').text()).to.eq(`available for 00:01`);
    });
  });

  context('given currently busy props', () => {
    const duration = moment.duration(1, 'minutes');
    const currentlyBusyProps = { availability: CURRENTLY_BUSY, duration, conferenceRoomTitle: '' };
    const wrapper = buildWrapper(currentlyBusyProps);

    it('renders .available component', () => {
      expect(wrapper.find('.unavailable')).to.exist();
    });

    it('renders availability duration status', () => {
      expect(wrapper.find('p').text()).to.eq(`available in 00:01`);
    });
  });
});
