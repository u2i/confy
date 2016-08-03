import React from 'react';
import { shallow } from 'enzyme';
import Filter from 'components/calendar/filters/Filter';
import RoomFilters from 'components/calendar/filters/RoomFilters';
import { expect } from 'chai';
import ConferenceRoom from 'test/factories/ConferenceRoom';

describe('<RoomFilters />', () => {
  const conferenceRooms = ConferenceRoom.buildList(3);
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
      const wrapper = shallow(<RoomFilters filters={[conferenceRooms[0].id]} {...props} />);
      expect(wrapper.find(Filter).filterWhere(node => node.props().enabled)).to.have.lengthOf(1);
    });
  });
});
