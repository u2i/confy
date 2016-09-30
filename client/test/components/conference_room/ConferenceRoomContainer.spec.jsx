import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import ConferenceRoom from 'test/factories/ConferenceRoom';
import Event from 'test/factories/Event';
import ConferenceRoomContainer from 'app/components/conference_room/ConferenceRoomContainer';

import NextEvents from 'components/conference_room/event/NextEvents';
import Navbar from 'components/conference_room/layout/Navbar';
import CurrentEvent from 'components/conference_room/event/CurrentEvent';

describe('<ConferenceRoomContainer />', () => {
  const conferenceRooms = ConferenceRoom.buildList(3);
  const events = Event.buildList(3);
  const conferenceRoom = conferenceRooms[0];
  const shallowWrapper = shallow(<ConferenceRoomContainer allConferenceRooms={conferenceRooms}
                                                          activeConferenceRoom={conferenceRoom}
                                                          nextEvents={[]} />);
  const mountedWrapper = mount(<ConferenceRoomContainer allEvents={events}
                                                        allConferenceRooms={conferenceRooms}
                                                        activeConferenceRoom={conferenceRoom}
                                                        nextEvents={[]} />);

  it('renders <Navbar />', () => {
    expect(shallowWrapper).to.have.exactly(1).descendants(Navbar);
  });

  context('with current event', () => {
    const event = Event.build();
    const wrapper = mount(<ConferenceRoomContainer activeConferenceRoom={conferenceRoom}
                                                   allConferenceRooms={conferenceRooms}
                                                   allEvents={events}
                                                   currentEvent={event}
                                                   nextEvents={[]} />);

    it('renders <CurrentEvent />', () => {
      expect(wrapper).to.have.exactly(1).descendants(CurrentEvent);
    });
  });

  context('with next event', () => {
    const event = Event.build();
    const wrapper = mount(<ConferenceRoomContainer allConferenceRooms={conferenceRooms}
                                                   activeConferenceRoom={conferenceRoom}
                                                   allEvents={events}
                                                   nextEvents={[event]} />);

    it('renders <NextEvents />', () => {
      expect(wrapper).to.have.exactly(1).descendants(NextEvents);
    });
  });

  context('with no current or next event', () => {
    it('does not render <CurrentEvent />', () => {
      expect(mountedWrapper).to.not.have.descendants(CurrentEvent);
    });

    it('does not render <NextEvents />', () => {
      expect(mountedWrapper).to.not.have.descendants(NextEvents);
    });

    it('renders no event text', () => {
      expect(mountedWrapper.text()).to.contain('No more events for today');
    });
  });
});
