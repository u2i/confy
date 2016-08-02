import React from 'react';
import { shallow } from 'enzyme';
import Filter from '../../app/components/calendar/filters/Filter';
import RoomFilters from '../../app/components/calendar/filters/RoomFilters';
import { expect } from 'chai';
import ConferenceRoom from '../factories/ConferenceRoom';

describe('<RoomFilters />', () => {
  const [id1, id2, id3] = [1, 2, 3];
  const [title1, title2, title3] = ['title1', 'title2', 'title3'];
  const conferenceRoom1 = ConferenceRoom.build({ id: id1, title: title1 });
  const conferenceRoom2 = ConferenceRoom.build({ id: id2, title: title2 });
  const conferenceRoom3 = ConferenceRoom.build({ id: id3, title: title3 });
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
      const wrapper = shallow(<RoomFilters filters={[id1]} {...props} />);
      expect(wrapper.find(Filter).filterWhere(node => node.props().enabled)).to.have.lengthOf(1);
    });
  });
});
