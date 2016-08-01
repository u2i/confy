import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import DefaultProps from '../../factories/DefaultProps';

import { Table } from 'react-bootstrap';
import Calendar from '../../../app/components/calendar/Calendar';
import CalendarHeader from '../../../app/components/calendar/CalendarHeader';
import CalendarRow from '../../../app/components/calendar/CalendarRow';
import RoomFilters from '../../../app/components/calendar/filters/RoomFilters';

describe('<Calendar />', () => {
  const props = DefaultProps.build({
    days:  ['2016-07-28', '2016-07-29'],
    times: ['8:00', '9:00']
  });

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<Calendar {...props} />);
  });

  describe('#render', () => {
    it('renders calendar <Table />', () => {
      const table = wrapper.find(Table);
      expect(table).to.have.lengthOf(1);
      expect(table.hasClass('calendar')).to.be.true();
    });

    it('renders <RoomFilters /> components', () => {
      expect(wrapper.find(RoomFilters)).to.have.lengthOf(1);
    });

    it('renders a table column for each day', () => {
      expect(wrapper.find(CalendarHeader)).to.have.lengthOf(props.days.length);
    });

    it('renders a table row for each time', () => {
      expect(wrapper.find(CalendarRow)).to.have.lengthOf(props.times.length);
    });
  });

  describe('state', () => {
    it('initializes with empty filter list', () => {
      expect(wrapper.state('filteredRooms').size).to.equal(0);
    });

    it('updates filter set after enabling a filter', () => {
      wrapper.find(RoomFilters).simulate('enabled', 1);
      expect(wrapper.state('filteredRooms').size).to.equal(1);
      expect(wrapper.state('filteredRooms').includes(1)).to.be.true();
    });

    it('updates filter set after disabling a filter', () => {
      wrapper.find(RoomFilters).simulate('enabled', 1);
      wrapper.find(RoomFilters).simulate('disabled', 1);
      expect(wrapper.state('filteredRooms').size).to.equal(0);
      expect(wrapper.state('filteredRooms').includes(1)).to.be.false();
    });
  });
});
