import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';

import EventFullDescription from 'components/calendar/event/details/EventFullDescription';

describe('<EventFullDescription />', () => {
  context('when event has description', () => {
    const description = 'very important event';
    const wrapper = mount(<EventFullDescription description={description} />);

    it('renders event description', () => {
      expect(wrapper.text()).to.contain(description);
    });
  });
});
