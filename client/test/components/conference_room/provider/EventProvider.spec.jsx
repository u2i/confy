import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import ConferenceRoom from 'test/factories/ConferenceRoom';
import Event from 'test/factories/Event';
import EventSource from 'sources/EventSource';

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
  const nextEvent = Event.build();
  const ownProps = { example: true };

  const defaultWrapper = shallow(<EventProvider conferenceRoom={conferenceRoom}
                                                component={DummyComponent} {...ownProps} />);

  before(() => {
    sinon.stub(EventSource, 'fetch').resolves([]);
  });

  after(() => {
    EventSource.fetch.restore();
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

  it('provides <Component /> with current and next event', () => {
    defaultWrapper.setState({ currentEvent, nextEvent });
    expect(defaultWrapper.find(DummyComponent)).to.have.prop('currentEvent').equal(currentEvent);
    expect(defaultWrapper.find(DummyComponent)).to.have.prop('nextEvent').equal(nextEvent);
  });

  it('fetches events on update', () => {
    defaultWrapper.find(DummyComponent).simulate('update');
    expect(EventSource.fetch).to.have.been.calledOnce();
  });
});
