import { Map } from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';
import Filter from 'components/calendar/filters/Filter';
import RoomFilters from 'components/calendar/filters/RoomFilters';
import { expect } from 'chai';
import ConferenceRoom from 'test/factories/ConferenceRoom';

describe('<RoomFilters />', () => {
  const titles = [
    { title: 'Zamosc', kind: 'narnia' },
    { title: 'Andrychow', kind: 'narnia' },
    { title: 'Krakow', kind: 'big' }
  ];
  const conferenceRooms = titles.map(({ title, kind }) => ConferenceRoom.build({ title, kind }));
  const filters = new Map();
  const props = {
    conferenceRooms,
    onEnabled:  () => {},
    onDisabled: () => {},
    roomKinds: { narnia: 0, big: 1 }
  };
  const defaultWrapper = shallow(<RoomFilters filters={filters} {...props} />);

  describe('#render()', () => {
    it('renders .filter-container', () => {
      expect(defaultWrapper.find('.filter-container')).to.have.lengthOf(1);
    });

    it('renders appropriate number of <Filter />', () => {
      expect(defaultWrapper.find(Filter)).to.have.lengthOf(conferenceRooms.length);
    });

    it('renders <Filter /> with appropriate enabled prop', () => {
      const filters = new Map([[conferenceRooms[0].id, true]]);
      const wrapper = shallow(<RoomFilters filters={filters} {...props} />);
      expect(wrapper.find(Filter).filterWhere(node => node.props().enabled)).to.have.lengthOf(1);
    });

    it('sorts by kind and title', () => {
      const filterNames = defaultWrapper.find(Filter).map(e => e.props().children);
      expect(filterNames).to.eql(['Krakow', 'Andrychow', 'Zamosc']);
    });
  });
});
