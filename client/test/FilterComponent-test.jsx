import React from 'react';
import { Checkbox } from 'react-bootstrap'
import { mount, shallow } from 'enzyme';
import Filter from '../app/components/calendar/filters/Filter'
import chai from 'chai'
import jsdom from 'mocha-jsdom'
import sinon from 'sinon'

var expect = chai.expect;

describe('<Filter />', () => {

    jsdom();
    let conferenceRoom = {id: 1, title: 'sample_tile', color: "#000000", capacity: 1};

    it('renders Checkbox component', () => {
        let props = {
            conferenceRoom: conferenceRoom,
            onEnabled: () => {},
            onDisabled: () => {},
            enabled: false
        };
        const wrapper = shallow(<Filter {...props}/>);
        expect(wrapper.find(Checkbox)).to.have.length(1);
    });

    it('responds to users action', () => {
        let onEnabled = sinon.spy();
        let onDisabled = sinon.spy();
        let props = {
            conferenceRoom: conferenceRoom,
            onEnabled: onEnabled,
            onDisabled: onDisabled,
            enabled: false
        };
        const wrapper = mount(<Filter {...props}/>);
        wrapper.find('input').simulate('change');
        expect(onDisabled).to.have.property('callCount', 1);
        expect(onEnabled).to.have.property('callCount', 0);
    });

});
