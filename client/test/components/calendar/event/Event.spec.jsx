import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import EventFactory from 'test/factories/Event';
import Attendee from 'test/factories/Attendee';
import Event from 'components/calendar/event/Event';

describe('<Event />', () => {
  const containerHeight = 30;
  const containerWidth = 100;
  const unitEventLengthInSeconds = 30 * 60;
  const timeFormat = 'HH:mm';
  const onDelete = sinon.spy();
  const [userEmail1, userEmail2] = ['mail1@example.com', 'mail2@example.com'];
  const currentUserEmail = userEmail1;
  const attendee1 = Attendee.build({ email: userEmail1 });
  const attendee2 = Attendee.build({ email: userEmail2 });

  const eventComponent = (event) => (
    <Event
      event={event}
      containerHeight={containerHeight}
      containerWidth={containerWidth}
      unitEventLengthInSeconds={unitEventLengthInSeconds}
      timeFormat={timeFormat}
      onDelete={onDelete} />
  );

  const options = {
    context: { userEmail: currentUserEmail },
    childContextTypes: { userEmail: React.PropTypes.string }
  };

  const shallowEvent = (event) => shallow(eventComponent(event), options);
  const mountEvent = (event) => mount(eventComponent(event), options);

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

  context('currentUserEmail is not present in attendees', () => {
    it("does not div with '.event .participating' className", () => {
      const wrapper = shallowEvent(EventFactory.build({ attendees: [attendee2] }));
      expect(wrapper.find('.event .participating')).not.to.exist();
    });
  });

  context('currentUserEmail is present in attendees', () => {
    it("renders div with '.event .participating' className", () => {
      const wrapper = mountEvent(EventFactory.build({ attendees: [attendee1, attendee2] }));
      expect(wrapper.find('.event .participating')).to.exist();
    });
  });
});
