import moment from 'moment';
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Event from 'test/factories/Event';

import EventContainer from 'components/conference_room/event/EventContainer';
import EventDetails from 'components/calendar/event/details/EventDetails';
import CurrentEvent from 'components/conference_room/event/CurrentEvent';
import TimeProgress from 'components/shared/time/TimeProgress';

describe('<CurrentEvent />', () => {
  const event = Event.build();
  const eventEnd = moment(event.end.date_time);

  it('renders <EventContainer />', () => {
    const wrapper = shallow(<CurrentEvent />);
    expect(wrapper).to.have.exactly(1).descendants(EventContainer);
  });

  context('with event', () => {
    const wrapper = mount(<CurrentEvent event={event} />);
    const timeProgressWrapper = wrapper.find(TimeProgress);

    it('renders <EventDetails />', () => {
      expect(wrapper).to.have.exactly(1).descendants(EventDetails);
    });

    it('renders <TimeProgress />', () => {
      expect(timeProgressWrapper).to.have.lengthOf(1);
    });

    it('renders <TimeProgress /> with end prop set to event end time', () => {
      expect(timeProgressWrapper.prop('end').isSame(eventEnd)).to.be.true();
    });
  });

  context('with no event', () => {
    it('does not render <EventDetails />', () => {
      const wrapper = mount(<CurrentEvent />);
      expect(wrapper).to.not.have.descendants(EventDetails);
    });

    context('with no next event', () => {
      const wrapper = mount(<CurrentEvent />);
      it('does not render <TimeProgress />', () => {
        expect(wrapper).to.not.have.descendants(TimeProgress);
      });
    });

    context('with next event', () => {
      const nextEventStart = moment().add(1, 'hour');
      const wrapper = mount(<CurrentEvent nextEventStart={nextEventStart} />);
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
