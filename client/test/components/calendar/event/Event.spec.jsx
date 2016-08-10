import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import EventFactory from 'test/factories/Event';
import UserFactory from 'test/factories/User';
import Event from 'components/calendar/event/Event';

describe('<Event />', () => {
  const containerHeight = 30;
  const containerWidth = 100;
  const unitEventLengthInSeconds = 30 * 60;
  const timeFormat = 'HH:mm';
  const onDelete = sinon.spy();

  const eventComponent = (event) => (
    <Event
      event={event}
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

  it('renders event start time', () => {
    expect(defaultWrapper.text()).to.include('0:00');
  });

  it('renders event end time', () => {
    expect(defaultWrapper.text()).to.include('2:00');
  });

  it('renders with correct height', () => {
    expect(defaultWrapper).to.have.style('height').equal('120px');
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

  context('with event summary provided', () => {
    const summary = 'Summary';
    const event = EventFactory.build({ summary });
    const wrapper = shallowEvent(event);

    it('renders event summary', () => {
      expect(wrapper.text()).to.include(summary);
    });
  });

  it('renders event location', () => {
    expect(defaultWrapper.text()).to.include(defaultEvent.conference_room.title);
  });

  describe('event creator', () => {
    describe('display name', () => {
      context('with creator display name provided', () => {
        const creatorDisplayName = 'creator';
        const event = EventFactory.build({ creator: UserFactory.build({ display_name: creatorDisplayName }) });
        const wrapper = shallowEvent(event);

        it('renders creator display name', () => {
          expect(wrapper.text()).to.include(creatorDisplayName);
        });
      });

      context('with no creator display name provided', () => {
        it('renders creator email', () => {
          expect(defaultWrapper.text()).to.include(defaultEvent.creator.email);
        });
      });
    });

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
})
;
