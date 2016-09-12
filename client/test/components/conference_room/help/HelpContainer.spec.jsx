import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import HelpContainer from 'components/conference_room/help/HelpContainer';
import HelpButton from 'components/conference_room/help/HelpButton';
import Help from 'components/conference_room/help/Help';

describe('<HelpContainer />', () => {
  const wrapper = shallow(<HelpContainer />);

  it('renders <Help /> modal', () => {
    expect(wrapper).to.have.exactly(1).descendants(Help);
  });

  it('renders <HelpButton />', () => {
    expect(wrapper).to.have.exactly(1).descendants(HelpButton);
  });
});
