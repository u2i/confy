import React from 'react';
import SideCalendar from 'components/calendar/layout/SideCalendar';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

describe('<SideCalendar />', () => {
  const spy = sinon.spy();
  const routerContext = { router: { push: spy } };
  const initialDate = moment();
  const wrapper = shallow(<SideCalendar date={initialDate} />, { context: routerContext });
  const stringDate = '2015-01-01';
  const date = moment(stringDate);

  describe('_routeToSelectedDate()', () => {
    const expectedQuery = `/?date=${stringDate}`;

    it('routes to appropriate path', () => {
      wrapper.instance()._routeToSelectedDate(date);

      expect(spy.calledWith(expectedQuery)).to.eq(true);
    });
  });
});
