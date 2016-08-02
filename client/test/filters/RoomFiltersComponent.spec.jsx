import React from 'react';
import { shallow } from 'enzyme';
import Filter from '../../app/components/calendar/filters/Filter';
import RoomFilters from '../../app/components/calendar/filters/RoomFilters';
import { expect } from 'chai';
import ConferenceRoom from '../factories/ConferenceRoom';

describe('<RoomFilters />', () => {
  const conferenceRoom1 = ConferenceRoom.build();
  const conferenceRoom2 = ConferenceRoom.build();
  const conferenceRoom3 = ConferenceRoom.build();
  const conferenceRooms = [conferenceRoom1, conferenceRoom2, conferenceRoom3];
  const props = {
    conferenceRooms,
    onEnabled:  () => {},
    onDisabled: () => {}
  };
  const defaultWrapper = shallow(<RoomFilters {...props} />);

  describe('#render()', () => {
    it('renders .filter-container', () => {
      expect(defaultWrapper.find('.filter-container')).to.have.lengthOf(1);
    });

    it('renders appropriate number of <Filter />', () => {
      expect(defaultWrapper.find(Filter)).to.have.lengthOf(conferenceRooms.length);
    });

    it('renders <Filter /> with appropriate enabled prop', () => {
      const wrapper = shallow(<RoomFilters filters={[conferenceRoom1.id]} {...props} />);
      expect(wrapper.find(Filter).filterWhere(node => node.props().enabled)).to.have.lengthOf(1);
    });
  });
});
