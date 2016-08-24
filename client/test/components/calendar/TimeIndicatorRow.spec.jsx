import React from 'react';
import moment from 'moment';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { expect } from 'chai';
import { mount } from 'enzyme';

describe('<TimeIndicatorRow />', () => {
  const style = { rowHeight: '32px' };
  const unitEventLength = 30 * 60;
  let clock;
  let days;
  let wrapper;
  const SECONDS_IN_HOUR = 1000 * 60 * 60;
  const TimeIndicatorRow = proxyquire('../../../app/components/calendar/TimeIndicatorRow', {
    './calendar.scss': style
  }).default;

  before(() => {
    clock = sinon.useFakeTimers();
    days = [moment().subtract(1, 'days'), moment(), moment().add(1, 'days')];
    wrapper = mount(
      <TimeIndicatorRow unitEventLengthInSeconds={unitEventLength} days={days} />
    );
  });

  after(() => {
    clock.restore();
  });


  describe('#render', () => {
    it('renders exactly one <tr />', () => {
      expect(wrapper.find('tr')).to.have.lengthOf(1);
    });

    it('renders exactly one time-cell inside <tr />', () => {
      expect(wrapper.find('tr').find('td.time-cell')).to.have.lengthOf(1);
    });

    it('renders 1 cell for time marker', () => {
      expect(wrapper.find('td.has-marker')).to.have.lengthOf(1);
    });

    it('renders time-marker inside today\'s column', () => {
      expect(wrapper.find('td.has-marker')).to.have.exactly(1).descendants('div#time-marker');
    });
  });

  describe('time-marker movement', () => {
    it('updates top property', () => {
      const topAttribute = () => wrapper.find('div#time-marker').prop('style').top;
      const initialTop = parseInt(topAttribute(), 10);
      clock.tick(SECONDS_IN_HOUR);
      expect(parseInt(topAttribute(), 10) - initialTop).to.eq(parseInt(style.rowHeight, 10) * 2);
    });
  });
});
