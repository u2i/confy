import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import CreateEventControls from 'components/conference_room/layout/controls/new_event/CreateEventControls';
import ToggleableControls from 'components/conference_room/layout/controls/new_event/ToggleableControls';
import StaticControls from 'components/conference_room/layout/controls/new_event/StaticControls';

describe('<CreateEventControls />', () => {
  context('with toggle text', () => {
    const wrapper = shallow(<CreateEventControls toggleText="Toggle" />);

    it('renders <ToggleableControls />', () => {
      expect(wrapper).to.have.exactly(1).descendants(ToggleableControls);
    });
  });

  context('with no toggle text', () => {
    const wrapper = shallow(<CreateEventControls />);

    it('renders <StaticControls />', () => {
      expect(wrapper).to.have.exactly(1).descendants(StaticControls);
    });
  });
});
