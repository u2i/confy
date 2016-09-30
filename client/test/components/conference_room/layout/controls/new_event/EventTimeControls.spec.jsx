import React from 'react';
import moment from 'moment';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import eventTimeControls from 'components/conference_room/layout/controls/new_event/EventTimeControls';
import TimeChoiceButton from 'components/conference_room/layout/controls/new_event/TimeChoiceButton';
import AvailableTimeButton from 'components/conference_room/layout/controls/new_event/AvailableTimeButton';

describe('<EventTimeControls />', () => {
  const ControlsContainer = (props) => <div>{eventTimeControls(props)}</div>;

  it('renders time buttons', () => {
    const wrapper = shallow(<ControlsContainer />);
    expect(wrapper.find(TimeChoiceButton)).to.have.lengthOf(3);
  });

  context('without next event', () => {
    const wrapper = mount(<ControlsContainer />);

    it('does not render <AvailableTimeButton />', () => {
      expect(wrapper).not.to.have.descendants(AvailableTimeButton);
    });
  });

  context('with next event', () => {
    const wrapper = mount(<ControlsContainer nextEventStart={moment().add(2, 'hours')} />);

    it('does not render <AvailableTimeButton />', () => {
      expect(wrapper).to.have.descendants(AvailableTimeButton);
    });
  });
});
