import React from 'react';
import Event from 'test/factories/Event';
import TimeProgress from 'components/shared/time/TimeProgress';
import moment from 'moment';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import TimeProgressContainer from 'components/conference_room/event/TimeProgressContainer';

describe('<TimeProgressContainer />', () => {
  const event = Event.build();
  const eventEnd = moment(event.end.date_time);

  context('with event', () => {
    const wrapper = shallow(<TimeProgressContainer event={event} />);
    const timeProgressWrapper = wrapper.find(TimeProgress);

    it('renders <TimeProgress />', () => {
      expect(timeProgressWrapper).to.have.lengthOf(1);
    });

    it('renders <TimeProgress /> with end prop set to event end time', () => {
      expect(timeProgressWrapper.prop('end').isSame(eventEnd)).to.be.true();
    });
  });

  context('with no event', () => {
    context('with next event', () => {
      const nextEventStart = moment().add(1, 'hour');
      const wrapper = shallow(<TimeProgressContainer nextEventStart={nextEventStart} />);
      const timeProgressWrapper = wrapper.find(TimeProgress);

      it('renders <TimeProgress />', () => {
        expect(wrapper).to.have.exactly(1).descendants(TimeProgress);
      });

      it('sets <TimeProgress /> end to start of next event', () => {
        expect(timeProgressWrapper.prop('end').isSame(nextEventStart)).to.be.true();
      });
    });
  });
});
