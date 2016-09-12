import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Event from 'test/factories/Event';

import Controls from 'components/conference_room/layout/controls/Controls';
import EventControls from 'components/conference_room/layout/controls/event/EventControls';
import NoEventControls from 'components/conference_room/layout/controls/NoEventControls';

describe('<Controls />', () => {
  context('with event', () => {
    const event = Event.build();
    const wrapper = shallow(<Controls event={event} />);

    it('renders <EventControls />', () => {
      expect(wrapper).to.have.exactly(1).descendants(EventControls);
    });
  });

  context('with no event', () => {
    const wrapper = shallow(<Controls />);

    it('renders <NoEventControls />', () => {
      expect(wrapper).to.have.exactly(1).descendants(NoEventControls);
    });
  });
});
