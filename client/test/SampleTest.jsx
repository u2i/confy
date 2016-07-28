import React from 'react';
import { Checkbox } from 'react-bootstrap'
import { mount, shallow } from 'enzyme';
import RoomFilters from '../app/components/calendar/RoomFilters'
import chai from 'chai'
import jsdom from 'mocha-jsdom'

var expect = chai.expect;

describe('<RoomFilters />', () => {

    jsdom();

    it('renders Checkbox component', () => {
        let conferenceRooms = [{id: 12, title: "ala", color:"#000000"}];
        const wrapper = shallow(<RoomFilters add={a => a+2} delete={b => b-2} conferenceRooms={conferenceRooms}/>);
        const wrapper2 = mount(<RoomFilters add={a => a+2} delete={b => b-2} conferenceRooms={conferenceRooms}/>);
        expect(wrapper2.find(Checkbox)).to.have.length(1);
        expect(wrapper.find(Checkbox)).to.have.length(1);
        expect(wrapper.is('div')).to.eq(true);
    });

});