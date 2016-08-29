import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import EventFactory from 'test/factories/Event';
import UserFactory from 'test/factories/User';
import Attendee from 'test/factories/Attendee';
import Event from 'components/calendar/event/Event';

describe('<Event />', () => {
  const containerHeight = 30;
  const containerWidth = 100;
  const unitEventLengthInSeconds = 30 * 60;
  const timeFormat = 'HH:mm';
  const onDelete = sinon.spy();
  const userEmail = 'user@email.com';
  const attendee = Attendee.build({email: userEmail});
  const attendees = [attendee];

  const eventComponent = (event) => (
    <Event
      event={event}
      userEmail={userEmail}
      attendees={attendees}
      containerHeight={containerHeight}
      containerWidth={containerWidth}
      unitEventLengthInSeconds={unitEventLengthInSeconds}
      timeFormat={timeFormat}
      onDelete={onDelete} />
  );

  const shallowEvent = (event) => shallow(eventComponent(event));
  const mountEvent = (event) => mount(eventComponent(event));

  const defaultEvent = EventFactory.build();
  const defaultWrapper = shallowEvent(defaultEvent);

  it('renders with correct minHeight', () => {
    expect(defaultWrapper).to.have.style('min-height').equal('120px');
  });

  it('renders with correct width', () => {
    const event = EventFactory.build({ width: 0.5 });
    const wrapper = shallowEvent(event);

    expect(defaultWrapper).to.have.style('width').equal('100px');
    expect(wrapper).to.have.style('width').equal('50px');
  });

  it('renders with correct offset', () => {
    const event = EventFactory.build({ width: 0.5, offset: 1 });
    const wrapper = shallowEvent(event);

    expect(wrapper).to.have.style('left').equal('50px');
  });

  it('renders with correct background color', () => {
    expect(defaultWrapper).to.have.style('background-color').equal(defaultEvent.conference_room.color);
  });

  it("renders div with '.event highlight' className", () => {
    const wrapper = shallowEvent(EventFactory.build());
    expect(wrapper.find('.event highlight')).to.exists
  });

  describe('event creator', () => {
    describe('self', () => {
      context('when creator is the current user', () => {
        it('does not render <Overlay /> with tooltip', () => {
          const event = EventFactory.build({ creator: UserFactory.build({ self: true }) });
          const wrapper = mountEvent(event);
          expect(wrapper.find('.enabled')).to.have.lengthOf(1);
        });
      });

      context('when creator is not the current user', () => {
        it('renders <Overlay /> with tooltip', () => {
          const wrapper = mountEvent(defaultEvent);
          expect(wrapper.find('.enabled')).to.have.lengthOf(0);
        });
      });
    });
  });
});

