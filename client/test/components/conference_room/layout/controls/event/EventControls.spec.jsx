import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import Event from 'test/factories/Event';

import EventControls from 'components/conference_room/layout/controls/event/EventControls';
import InProgress from 'components/conference_room/layout/controls/event/InProgress';
import Unstarted from 'components/conference_room/layout/controls/event/Unstarted';

describe('<EventControls />', () => {
  context('with unconfirmed event', () => {
    const event = Event.build();
    const wrapper = shallow(<EventControls event={event} />);

    it('renders <Unstarted />', () => {
      expect(wrapper).to.have.exactly(1).descendants(Unstarted);
    });
  });

  context('with confirmed event', () => {
    const event = Event.build({ confirmed: true });
    const wrapper = shallow(<EventControls event={event} />);

    it('renders <InProgress />', () => {
      expect(wrapper).to.have.exactly(1).descendants(InProgress);
    });
  });
});
