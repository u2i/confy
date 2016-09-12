import { Map } from 'immutable';
import moment from 'moment';
import React from 'react';
import shared from 'mocha-shared';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import DefaultProps from '../../factories/DefaultProps';
import { Table } from 'react-bootstrap';
import Calendar from 'components/calendar/table/Calendar';
import CalendarHeader from 'components/calendar/table/CalendarHeader';
import CalendarRow from 'components/calendar/table/CalendarRow';
import RoomFilters from 'components/calendar/filters/RoomFilters';
import * as FiltersHelper from 'helpers/FiltersHelper';

describe('<Calendar />', () => {

  before(() => {
    sinon.stub(FiltersHelper, 'loadFilters').returns(new Map());
    sinon.stub(FiltersHelper, 'saveFilters');
  });

  after(() => {
    FiltersHelper.loadFilters.restore();
    FiltersHelper.saveFilters.restore();
  });

  const props = DefaultProps.build({
    times: [moment({ hours: 8 }), moment({ hours: 9 })],
    onDelete: () => {
    }
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

    it('updates filter map after enabling a filter', () => {
      wrapper.setState({ filteredRooms: new Map([[1, false]]) });
      wrapper.find(RoomFilters).simulate('filterToggle', 1);
      expect(wrapper.state('filteredRooms').get(1)).to.eq(true);
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
      FiltersHelper.loadFilters.returns(new Map([[1, true]]));

      wrapper = mount(<Calendar {...props} scrollTo={{ hours: 8, minutes: 0 }} />);
      expect(scrollSpy).to.have.been.called();
    });
  });
});
