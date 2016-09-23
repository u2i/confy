import React from 'react';
import NoEvent from 'components/conference_room/event/NoEvent';
import { expect } from 'chai';
import { shallow } from 'enzyme';


describe('<NoEvent />', () => {
  const wrapper = shallow(<NoEvent />);

  it('renders message', () => {
    expect(wrapper).to.have.text('No event currently in progress');
  });
});