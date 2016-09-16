import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import ConferenceRoom from 'test/factories/ConferenceRoom';
import Event from 'test/factories/Event';
import EventSource from 'sources/EventSource';
import moment from 'moment';

describe('<EventProvider />', () => {
  const subscriptionSpy = sinon.spy();

  const EventProvider = proxyquire
    .noCallThru()
    .load('../../../../app/components/conference_room/provider/EventProvider', {
      '../../../cable': {
        createSubscription: subscriptionSpy
      }
    }).default;

  const DummyComponent = () => <div></div>;

  const conferenceRoom = ConferenceRoom.build();
  const currentEvent = Event.build();
  const nextEvents = Event.buildList(3);
  const ownProps = { example: true };

  const defaultWrapper = shallow(<EventProvider conferenceRoom={conferenceRoom}
                                                component={DummyComponent} {...ownProps} />);

  before(() => {
    sinon.stub(EventSource, 'fetch').resolves([]);
  });

  after(() => {
    EventSource.fetch.restore();
  });

  afterEach(() => {
    EventSource.fetch.reset();
  });

  it('renders <Component />', () => {
    expect(defaultWrapper).to.have.exactly(1).descendants(DummyComponent);
  });

  it('passes own props to <Component />', () => {
    expect(defaultWrapper.find(DummyComponent)).to.have.prop('example').equal(true);
  });

  it('passes conferenceRoom prop to <Component />', () => {
    expect(defaultWrapper.find(DummyComponent)).to.have.prop('conferenceRoom').equal(conferenceRoom);
  });

  it('provides <Component /> with current and next events', () => {
    defaultWrapper.setState({ currentEvent, nextEvents });
    expect(defaultWrapper.find(DummyComponent)).to.have.prop('currentEvent').equal(currentEvent);
    expect(defaultWrapper.find(DummyComponent)).to.have.prop('nextEvents').equal(nextEvents);
  });

  it('fetches events on update', () => {
    defaultWrapper.find(DummyComponent).simulate('update');
    expect(EventSource.fetch).to.have.been.calledOnce();
  });

  describe('reloading page on next day', () => {
    const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
    context('on 00:00 AM', () => {
      let clock;
      before(() => {
        clock = sinon.useFakeTimers();
      });

      after(() => {
        clock.restore();
      });

      it('reloads page on next day', () => {
        mount(<EventProvider conferenceRoom={conferenceRoom}
                             component={DummyComponent} {...ownProps} />);
        EventSource.fetch.reset();
        clock.tick(MILLISECONDS_IN_DAY);
        expect(EventSource.fetch).to.have.been.calledOnce();
      });
    });

    context('on 01:52 PM', () => {
      let clock;
      const timeStamp = moment(0).add(13, 'hours').add(52, 'minutes').valueOf();

      before(() => {
        clock = sinon.useFakeTimers(timeStamp);
      });

      after(() => {
        clock.restore();
      });

      it('reloads page on next day', () => {
        mount(<EventProvider conferenceRoom={conferenceRoom}
                             component={DummyComponent} {...ownProps} />);
        EventSource.fetch.reset();
        clock.tick(MILLISECONDS_IN_DAY - timeStamp);
        expect(EventSource.fetch).to.have.been.calledOnce();
      });
    });
  });
});
