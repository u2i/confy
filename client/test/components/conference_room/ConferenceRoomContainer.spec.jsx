import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import proxyquire from 'proxyquire';
import ConferenceRoom from 'test/factories/ConferenceRoom';
import Event from 'test/factories/Event';

import Clock from 'components/shared/time/Clock';
import NextEvent from 'components/conference_room/event/NextEvent';

describe('<ConferenceRoomContainer />', () => {
  const DummyCurrentEvent = () => <div></div>;

  const ConferenceRoomContainer = proxyquire
    .noCallThru()
    .load('../../../app/components/conference_room/ConferenceRoomContainer', {
      './event/CurrentEvent': DummyCurrentEvent
    }).default;

  const conferenceRoom = ConferenceRoom.build();
  const shallowWrapper = shallow(<ConferenceRoomContainer conferenceRoom={conferenceRoom} />);
  const mountedWrapper = mount(<ConferenceRoomContainer conferenceRoom={conferenceRoom} />);

  it('renders conference room title', () => {
    expect(shallowWrapper.find('.room-header h1')).to.have.text(conferenceRoom.title);
  });

  it('renders a <Clock /> component', () => {
    expect(shallowWrapper).to.have.exactly(1).descendants(Clock);
  });

  it('renders a header with conference room color as background', () => {
    expect(shallowWrapper.find('.room-header')).to.have.style('background-color').equal(conferenceRoom.color);
  });

  context('with current event', () => {
    const event = Event.build();
    const wrapper = mount(<ConferenceRoomContainer conferenceRoom={conferenceRoom} currentEvent={event} />);

    it('renders <CurrentEvent />', () => {
      expect(wrapper).to.have.exactly(1).descendants(DummyCurrentEvent);
    })
  });

  context('with next event', () => {
    const event = Event.build();
    const wrapper = mount(<ConferenceRoomContainer conferenceRoom={conferenceRoom} nextEvent={event} />);

    it('renders <NextEvent />', () => {
      expect(wrapper).to.have.exactly(1).descendants(NextEvent);
    });
  });

  context('with no current or next event', () => {
    it('does not render <CurrentEvent />', () => {
      expect(mountedWrapper).to.not.have.descendants(DummyCurrentEvent);
    });

    it('does not render <NextEvent />', () => {
      expect(mountedWrapper).to.not.have.descendants(NextEvent);
    });

    it('renders no event text', () => {
      expect(mountedWrapper.text()).to.contain('There are no more events for today');
    })
  });
});
