import React from 'react';
import { Checkbox } from 'react-bootstrap'
import { mount, shallow } from 'enzyme';
import RoomFilters from '../app/components/calendar/filters/RoomFilters'
import Filter from '../app/components/calendar/filters/Filter'
import chai from 'chai'
import jsdom from 'mocha-jsdom'

var expect = chai.expect;

describe('<RoomFilters />', () => {

    jsdom();

    it('renders Filter component', () => {
        let conferenceRooms = [{id: 12, title: "ala", color:"#000000"}];
        const wrapper = shallow(<RoomFilters onEnabled={a => a+2} onDisabled={b => b-2} conferenceRooms={conferenceRooms}/>);
        expect(wrapper.find(Filter)).to.have.length(1);
        expect(wrapper.is('div')).to.eq(true);
    });

});
