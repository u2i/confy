import moment from 'moment';
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import EventFactory from 'test/factories/Event';
import CurrentEvent from 'components/conference_room/event/CurrentEvent';
import NoEvent from 'components/conference_room/event/NoEvent';
import TimeProgressContainer from 'components/conference_room/event/TimeProgressContainer';
import Event from 'components/conference_room/event/Event';
import Controls from 'components/conference_room/layout/controls/Controls';

describe('<CurrentEvent />', () => {
  const event = EventFactory.build();

  context('with event', () => {
    const wrapper = shallow(<CurrentEvent event={event} />);

    it('renders <Event />', () => {
      expect(wrapper).to.have.exactly(1).descendants(Event);
    });

    it('renders <TimeProgressContainer />', () => {
      expect(wrapper).to.have.exactly(1).descendants(TimeProgressContainer);
    });
  });

  context('with no event', () => {
    it('renders <NoEvent />', () => {
      const wrapper = shallow(<CurrentEvent />);
      expect(wrapper).to.have.exactly(1).descendants(NoEvent);
    });

    context('with no next event', () => {
      const wrapper = shallow(<CurrentEvent />);

      it('does not render <TimeProgressContainer />', () => {
        expect(wrapper).to.not.have.descendants(TimeProgressContainer);
      });
    });

    context('with next event', () => {
      const nextEventStart = moment().add(1, 'hour');
      const wrapper = shallow(<CurrentEvent nextEventStart={nextEventStart} />);

      it('renders <TimeProgressContainer />', () => {
        expect(wrapper).to.have.exactly(1).descendants(TimeProgressContainer);
      });
    });
  });

  it('renders <Controls />', () => {
    const wrapper = shallow(<CurrentEvent event={event} />);
    expect(wrapper).to.have.exactly(1).descendants(Controls);
  });
});
