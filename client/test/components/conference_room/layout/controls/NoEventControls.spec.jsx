import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import NoEventControls from 'components/conference_room/layout/controls/NoEventControls';
import StartButton from 'components/conference_room/layout/controls/StartButton';
import EventTimeControls from 'components/conference_room/layout/controls/new_event/EventTimeControls';

describe('<NoEventControls />', () => {
  it('renders <StartButton /> by default', () => {
    const wrapper = mount(<NoEventControls />);
    expect(wrapper).to.have.exactly(1).descendants(StartButton);
    expect(wrapper).not.to.have.descendants(EventTimeControls);
  });

  context('when <StartButton /> is clicked', () => {
    const wrapper = mount(<NoEventControls />);

    before(() => {
      wrapper.find(StartButton).find('button').simulate('click');
    });

    it('renders <EventTimeControls />', () => {
      expect(wrapper).to.have.exactly(1).descendants(EventTimeControls);
      expect(wrapper).not.to.have.descendants(StartButton);
    });
  });

  context('when cancel button is clicked', () => {
    const wrapper = mount(<NoEventControls />);

    before(() => {
      wrapper.find(StartButton).find('button').simulate('click');
      wrapper.find(EventTimeControls)
        .find('button')
        .findWhere(button => button.text() === 'Cancel')
        .simulate('click');
    });

    it('renders <StartButton />', () => {
      expect(wrapper).to.have.exactly(1).descendants(StartButton);
      expect(wrapper).not.to.have.descendants(EventTimeControls);
    });
  });
});
