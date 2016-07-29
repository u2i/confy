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

    let sampleColor = "#000000";
    let sampleTitle = 'sample_title';
    let sampleConferenceRoomId = 1;
    let sampleCapacity = 1;
    let conferenceRoom = {
        id: sampleConferenceRoomId,
        title: sampleTitle,
        color: sampleColor,
        capacity: sampleCapacity
    };
    let defaultProps = {
        conferenceRoom: conferenceRoom,
        onEnabled: () => {},
        onDisabled: () => {},
        enabled: false
    };
    let defaultWrapper = shallow(<Filter {...defaultProps} />);

    it('renders Checkbox component', () => {
        expect(defaultWrapper.find(Checkbox)).to.have.length(1);
    });

    it("sets .filter-box backgroundColor", () => {
        expect(defaultWrapper.find('.filter-box').props().style.backgroundColor).to.eq(sampleColor);
    });

    it('puts conference room title inside Checkbox component', () => {
        expect(defaultWrapper.find(Checkbox).children().text()).to.eq(sampleTitle);
    });

    it("triggers appropriate handler based on 'enabled' prop", () => {
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
        expect(onDisabled.calledWith(sampleConferenceRoomId)).to.eq(true);

        wrapper.setProps({enabled: true});

        wrapper.find('input').simulate('change');
        expect(onEnabled).to.have.property('callCount', 1);
        expect(onEnabled.calledWith(sampleConferenceRoomId)).to.eq(true);
    });
});
