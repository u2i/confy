import moment from 'moment';
import React from 'react';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import CalendarRow from 'components/calendar/CalendarRow';
import EventWrapper from 'components/calendar/event/EventWrapper';
import Event from 'test/factories/Event';
import TimeCell from 'components/calendar/TimeCell';
import { expect } from 'chai';

describe('<CalendarRow />', () => {
  const group1 = [Event.build(), Event.build()];
  const group2 = [Event.build(), Event.build()];
  const events = [group1, group2];
  const days = [moment(), moment(), moment()];
  const unitEventLengthInSeconds = 1800;
  const onDelete = sinon.spy();
  let time;
  const props = { events, days, unitEventLengthInSeconds, onDelete };
  let wrapper = shallow(<CalendarRow time={moment()} {...props} />);

  beforeEach(() => {
    time = moment();
  });

  describe('#render()', () => {
    it('renders exactly one <tr />', () => {
      expect(wrapper.find('tr')).to.have.length(1);
    });

    it('renders exactly one <TimeCell /> inside <tr />', () => {
      expect(wrapper.find('tr').find(TimeCell)).to.have.length(1);
    });

    it('renders <EventWrapper /> inside <tr /> for each day in days array', () => {
      expect(wrapper.find('tr').find(EventWrapper)).to.have.length(days.length);
    });

    describe('displayMinutes prop equals true', () => {
      it('renders <TimeCell /> with visible prop set to true', () => {
        wrapper = shallow(<CalendarRow displayMinutes time={time} {...props} />);

        expect(wrapper.find(TimeCell).props().visible).to.eq(true);
      });
    });

    describe('displayMinutes prop equals false', () => {
      describe('time minutes field equals 0', () => {
        it('renders <TimeCell /> with visible prop set to true', () => {
          wrapper = shallow(<CalendarRow time={time.minutes(0)} {...props} />);

          expect(wrapper.find(TimeCell).props().visible).to.eq(true);
        });
      });

      describe('time minutes field doest not equal 0', () => {
        it('renders <TimeCell /> with visible prop set to false', () => {
          wrapper = shallow(<CalendarRow time={time.minutes(1)} {...props} />);

          expect(wrapper.find(TimeCell).props().visible).to.eq(false);
        });
      });
    });
  });
});
