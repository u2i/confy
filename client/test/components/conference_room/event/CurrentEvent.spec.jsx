import moment from 'moment';
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Event from 'test/factories/Event';

import EventDetails from 'components/calendar/event/details/EventDetails';
import CurrentEvent from 'components/conference_room/event/CurrentEvent';
import TimeProgress from 'components/shared/time/TimeProgress';

describe('<CurrentEvent.Event />', () => {
  const summary = 'Summary';
  const event = Event.build({ summary });

  const wrapper = shallow(<CurrentEvent.Event event={event} />);

  it('renders event summary', () => {
    expect(wrapper.text()).to.contain(summary);
  });

  it('renders <EventDetails /> with time, creator, attendees and description', () => {
    expect(wrapper).to.have.exactly(1).descendants(EventDetails);
    expect(wrapper.find(EventDetails)).to.have.prop('fields').eql(['time', 'creator', 'attendees', 'description']);
  });
});

describe('<CurrentEvent.NoEvent />', () => {
  const wrapper = shallow(<CurrentEvent.NoEvent />);

  it('renders message', () => {
    expect(wrapper).to.have.text('No event currently in progress');
  });
});

describe('<CurrentEvent.TimeProgressContainer />', () => {
  const event = Event.build();
  const eventEnd = moment(event.end.date_time);

  context('with event', () => {
    const wrapper = shallow(<CurrentEvent.TimeProgressContainer event={event} />);
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
      const wrapper = shallow(<CurrentEvent.TimeProgressContainer nextEventStart={nextEventStart} />);
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

describe('<CurrentEvent />', () => {
  const event = Event.build();

  context('with event', () => {
    const wrapper = shallow(<CurrentEvent event={event} />);

    it('renders <CurrentEvent.Event />', () => {
      expect(wrapper).to.have.exactly(1).descendants(CurrentEvent.Event);
    });

    it('renders <CurrentEvent.TimeProgressContainer />', () => {
      expect(wrapper).to.have.exactly(1).descendants(CurrentEvent.TimeProgressContainer);
    });
  });

  context('with no event', () => {
    it('renders <CurrentEvent.NoEvent />', () => {
      const wrapper = shallow(<CurrentEvent />);
      expect(wrapper).to.have.exactly(1).descendants(CurrentEvent.NoEvent);
    });

    context('with no next event', () => {
      const wrapper = shallow(<CurrentEvent />);

      it('does not render <CurrentEvent.TimeProgressContainer />', () => {
        expect(wrapper).to.not.have.descendants(CurrentEvent.TimeProgressContainer);
      });
    });

    context('with next event', () => {
      const nextEventStart = moment().add(1, 'hour');
      const wrapper = shallow(<CurrentEvent nextEventStart={nextEventStart} />);

      it('renders <CurrentEvent.TimeProgressContainer />', () => {
        expect(wrapper).to.have.exactly(1).descendants(CurrentEvent.TimeProgressContainer);
      });
    });
  });
});
