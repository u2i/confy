import React from 'react';
import shared from 'mocha-shared';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import DefaultProps from '../../factories/DefaultProps';
import { Table } from 'react-bootstrap';
import Calendar from 'components/calendar/Calendar';
import CalendarHeader from 'components/calendar/CalendarHeader';
import CalendarRow from 'components/calendar/CalendarRow';
import RoomFilters from 'components/calendar/filters/RoomFilters';
import * as FiltersHelper from 'helpers/FiltersHelper';
import proxyquire from 'proxyquire';
import { Set } from 'immutable';

describe('<Calendar />', () => {

  before(() => {
    sinon.stub(FiltersHelper, 'loadFilters').returns(new Set());
    sinon.stub(FiltersHelper, 'saveFilters');
    proxyquire('../../../app/helpers/FiltersHelper', FiltersHelper);
  });

  after(() => {
    FiltersHelper.loadFilters.restore();
    FiltersHelper.saveFilters.restore();
  });

  const props = DefaultProps.build({
    onDelete: () => {}
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

  describe('scrolling behaviour', () => {
    let scrollSpy;
    shared.setup('stub ReactDOM.findDOMNode', {
      cb: (node) => {
        scrollSpy = node.scrollIntoView = sinon.spy();
      }
    });

    it('scrolls calendar to row with scrollTo time', () => {
      wrapper = mount(<Calendar {...props} />);
      expect(scrollSpy).to.have.been.called();
    });
  });
});
