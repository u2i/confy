import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import ConferenceRoom from 'test/factories/ConferenceRoom';
import { Navbar } from 'react-bootstrap';

import RoomNavbar from 'components/conference_room/layout/Navbar';
import Clock from 'components/shared/time/Clock';
import HelpContainer from 'components/conference_room/help/HelpContainer';

describe('<Navbar />', () => {
  const conferenceRoom = ConferenceRoom.build();
  const wrapper = shallow(<RoomNavbar conferenceRoom={conferenceRoom} />);

  it('renders bootstrap <Navbar />', () => {
    expect(wrapper).to.have.exactly(1).descendants(Navbar);
  });

  it('renders conference room title', () => {
    expect(wrapper.find(Navbar.Brand).find('h2')).to.have.text(conferenceRoom.title);
  });

  it('renders a <Clock /> component', () => {
    expect(wrapper).to.have.exactly(1).descendants(Clock);
  });

  it('renders a header with conference room color as background', () => {
    expect(wrapper.find(Navbar)).to.have.style('background-color').equal(conferenceRoom.color);
  });

  it('renders <HelpContainer />', () => {
    expect(wrapper).to.have.exactly(1).descendants(HelpContainer);
  });
});
