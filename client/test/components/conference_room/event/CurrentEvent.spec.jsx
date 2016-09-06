import moment from 'moment';
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import proxyquire from 'proxyquire';
import Event from 'test/factories/Event';

import EventContainer from 'components/conference_room/event/EventContainer';
import EventDetails from 'components/calendar/event/details/EventDetails';

describe('<CurrentEvent />', () => {
  const DummyTimeProgress = () => <div></div>;

  const CurrentEvent = proxyquire.noCallThru().load('../../../../app/components/conference_room/event/CurrentEvent', {
    '../../shared/time/TimeProgress': DummyTimeProgress
  }).default;

  const event = Event.build();
  const eventStart = moment(event.start.date_time).unix();
  const eventEnd = moment(event.end.date_time).unix();

  it('renders <EventContainer />', () => {
    const wrapper = shallow(<CurrentEvent />);
    expect(wrapper).to.have.exactly(1).descendants(EventContainer);
  });

  context('with event', () => {
    const wrapper = mount(<CurrentEvent event={event} />);
    const timeProgressWrapper = wrapper.find(DummyTimeProgress);

    it('renders <EventDetails />', () => {
      expect(wrapper).to.have.exactly(1).descendants(EventDetails);
    });

    it('renders <TimeProgress />', () => {
      expect(timeProgressWrapper).to.have.lengthOf(1);
    });

    it('renders <TimeProgress /> with time boundaries set to event time boundaries', () => {
      expect(timeProgressWrapper).to.have.prop('start').equal(eventStart);
      expect(timeProgressWrapper).to.have.prop('end').equal(eventEnd);
    });

    it('animates <TimeProgress />', () => {
      expect(timeProgressWrapper).to.have.prop('animate').equal(true);
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
        expect(wrapper).to.not.have.descendants(DummyTimeProgress);
      });
    });

    context('with next event', () => {
      const nextEventStart = moment().add(1, 'hour');
      const wrapper = mount(<CurrentEvent nextEventStart={nextEventStart} />);
      const timeProgressWrapper = wrapper.find(DummyTimeProgress);

      it('renders <TimeProgress />', () => {
        expect(wrapper).to.have.exactly(1).descendants(DummyTimeProgress);
      });

      it('sets <TimeProgress /> end to start of next event', () => {
        expect(timeProgressWrapper).to.have.prop('end').equal(nextEventStart.unix());
      });

      it('does not animate <TimeProgress />', () => {
        expect(timeProgressWrapper).to.have.prop('animate').equal(false);
      });
    });
  });
});
