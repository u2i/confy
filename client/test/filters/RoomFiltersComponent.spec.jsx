import React from 'react';
import { mount, shallow } from 'enzyme';
import Filter from '../../app/components/calendar/filters/Filter';
import RoomFilters from '../../app/components/calendar/filters/RoomFilters';
import chai from 'chai';

const expect = chai.expect;

describe('<RoomFilters />', () => {
  const [id1, id2, id3] = [1,2,3];
  const [title1, title2, title3] = ['title1', 'title2', 'title3'];
  const conferenceRoom1 = {
    id: id1,
    title: title1
  };
  const conferenceRoom2 = {
    id: id2,
    title: title2
  };
  const conferenceRoom3 = {
    id: id3,
    title: title3
  };
  const conferenceRooms = [conferenceRoom1, conferenceRoom2, conferenceRoom3];
  const props = {
    conferenceRooms,
    onEnabled: () => {},
    onDisabled: () => {}
  };
  const defaultWrapper = shallow(<RoomFilters {...props} />);

  it('renders .filter-container', () => {
    expect(defaultWrapper.find('.filter-container')).to.have.length(1);
  });

  it('renders appropriate number of <Filter />', () => {
    expect(defaultWrapper.find(Filter)).to.have.length(conferenceRooms.length);
  });

  describe('_filterEnabled', () => {
    it('checks if conferenceRoom is filtered', () => {
      defaultWrapper.setProps({ filters: [id1, id2] });
      expect(defaultWrapper.instance()._filterEnabled(conferenceRoom1)).to.eq(true);
      expect(defaultWrapper.instance()._filterEnabled(conferenceRoom2)).to.eq(true);
      expect(defaultWrapper.instance()._filterEnabled(conferenceRoom3)).to.eq(false);
    });
  });
});
