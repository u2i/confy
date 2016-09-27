import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import NoEventControls from 'components/conference_room/layout/controls/NoEventControls';
import CreateEventControls from 'components/conference_room/layout/controls/new_event/CreateEventControls';

describe('<NoEventControls />', () => {
  const wrapper = shallow(<NoEventControls />);
  const controls = wrapper.find(CreateEventControls);

  it('renders <CreateEventControls /> with "Start" toggle', () => {
    expect(controls).to.have.lengthOf(1);
    expect(controls).to.have.prop('toggleText').equal('Start');
  });
});
