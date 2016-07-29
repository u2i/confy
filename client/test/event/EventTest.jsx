import React from 'react';
import { Checkbox } from 'react-bootstrap'
import { mount, shallow } from 'enzyme';
import Event from '../../app/components/calendar/event/Event'
import chai from 'chai'
import jsdom from 'mocha-jsdom'

var expect = chai.expect;

describe('<Event />', () => {


    const sampleEvent = {
        attendees:[{response_status:"needsAction", self:true}],
        creator:{email:"creator@example.com",self:true},
        end:{date_time:"2016-07-25T02:30:00.000+02:00"},
        id:"7utc9k4ft8kf22734q72ihoq8c",
        start:{date_time:"2016-07-25T00:30:00.000+02:00"},
        conference_room:
            {
                id:8,
                capacity:10,
                title:"Narnia One",
                color:"#dffabd",
                email:"email@resource.calendar.google.com"
            },
        start_timestamp:1469397600,
        end_timestamp:1469406600,
        summary: "Sample Event"
    }
    const containerHeight = 30;
    const unitEventLengthInSeconds = 30 * 60;
    const timeFormat = 'HH:mm'

    jsdom();

    it('renders correctly', () => {
        const wrapper = mount(<Event event={sampleEvent} containerHeight={containerHeight} unitEventLengthInSeconds={unitEventLengthInSeconds} timeFormat={timeFormat}/>);
        expect(wrapper.find("div")).to.have.length(5);
        expect(wrapper.find(".event").props().style.height).to.eq(150);
        expect(wrapper.find(".event-time").text()).to.include("00:30");
        expect(wrapper.find(".event-name").text()).to.include("Sample Event");
        expect(wrapper.find(".event-user").text()).to.include("creator@example.com");
        expect(wrapper.find(".event-location").text()).to.include("Narnia One");
    });

    it('renders correctly with other length', () => {
        let eventClone = JSON.parse(JSON.stringify(sampleEvent));
        eventClone.end_timestamp += 60 * 60; // 1 hour
        const wrapper = mount(<Event event={eventClone} containerHeight={containerHeight} unitEventLengthInSeconds={unitEventLengthInSeconds} timeFormat={timeFormat}/>);
        expect(wrapper.find(".event").props().style.height).to.eq(210);
    })

});
