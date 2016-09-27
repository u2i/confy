import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import EventTimeControls from 'components/conference_room/layout/controls/new_event/EventTimeControls';
import TimeChoiceButton from 'components/conference_room/layout/controls/new_event/TimeChoiceButton';
import AvailableTimeButton from 'components/conference_room/layout/controls/new_event/AvailableTimeButton';

describe('<EventTimeControls />', () => {
  it('renders time buttons', () => {
    const wrapper = shallow(<EventTimeControls />);
    expect(wrapper.find(TimeChoiceButton)).to.have.lengthOf(3);
  });

  context('without next event', () => {
    const wrapper = mount(<EventTimeControls />);

    it('does not render <AvailableTimeButton />', () => {
      expect(wrapper).not.to.have.descendants(AvailableTimeButton);
    });
  });

  context('with next event', () => {
    const wrapper = mount(<EventTimeControls nextEventStart={moment().add(2, 'hours')} />);

    it('does not render <AvailableTimeButton />', () => {
      expect(wrapper).to.have.descendants(AvailableTimeButton);
    });
  });
});
