import React from 'react';
import { shallow, mount } from 'enzyme';
import Event from '../../app/components/calendar/event/Event';
import DeleteButton from '../../app/components/calendar/event/DeleteButton';
import { expect } from 'chai';
import { _ } from 'lodash';

describe('<Event />', () => {
    const eventSummary = 'Sample Event';
    const creator = { email: 'creator@example.com', self: true };
    const sampleRoom = {
        id: 8,
        capacity: 10,
        title: 'Narnia One',
        color: '#dffabd',
        email: 'email@resource.calendar.google.com'
    };
    const sampleEvent = {
        creator,
        attendees: [{ response_status: 'needsAction', self: true }],
        end: { date_time: '2016-07-25T02:30:00.000+02:00' },
        id: '7utc9k4fds8kf2734q72dsoq8c',
        start: { date_time: '2016-07-25T00:30:00.000+02:00' },
        conference_room: sampleRoom,
        start_timestamp: 1469397600,
        end_timestamp: 1469406600,
        summary: eventSummary
    };
    const containerHeight = 30;
    const unitEventLengthInSeconds = 30 * 60;
    const timeFormat = 'HH:mm';
    
    describe('creator.self', () => {
        it('renders delete button when self correctly', () => {
            const wrapper = mount(
                <Event
                    event={sampleEvent}
                    containerHeight={containerHeight}
                    unitEventLengthInSeconds={unitEventLengthInSeconds}
                    timeFormat={timeFormat} />
            );
            expect(wrapper.find(DeleteButton)).to.have.lengthOf(1);
        });

    });


    describe('undefined creator.self', () => {
        it('does not render delete button when not self', () => {
            let creatorClone = _.cloneDeep(creator);
            creatorClone.self = undefined;
            let eventClone = _.cloneDeep(sampleEvent);
            eventClone.creator = creatorClone;
            const wrapper = mount(
                <Event
                    event={eventClone}
                    containerHeight={containerHeight}
                    unitEventLengthInSeconds={unitEventLengthInSeconds}
                    timeFormat={timeFormat} />
            );
            expect(wrapper.find(DeleteButton)).to.have.lengthOf(0);
        });
    });

});