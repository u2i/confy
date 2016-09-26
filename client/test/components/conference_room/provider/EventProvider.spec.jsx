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

  const endTime = moment().add(30, 'minutes');
  const DummyComponent = ({ onFinish, onConfirm, onCreate, onCancel }) => ( // eslint-disable-line react/prop-types
    <div>
      <button id="finish" onClick={onFinish} />
      <button id="confirm" onClick={onConfirm} />
      <button id="create" onClick={() => onCreate(endTime)} />
      <button id="cancel" onClick={onCancel} />
    </div>
  );

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

  describe('event actions', () => {
    const wrapper = mount(<EventProvider conferenceRoom={conferenceRoom} component={DummyComponent} />);
    const componentWrapper = wrapper.find(DummyComponent);
    const confirmButton = componentWrapper.find('button#confirm');
    const finishButton = componentWrapper.find('button#finish');
    const cancelButton = componentWrapper.find('button#cancel');

    before(() => {
      sinon.stub(EventSource, 'confirm');
      sinon.stub(EventSource, 'finish');
    });

    after(() => {
      EventSource.confirm.restore();
      EventSource.finish.restore();
    });

    describe('confirming event', () => {
      context('with successful request', () => {
        before(() => {
          wrapper.setState({ currentEvent: Event.build({ confirmed: false }) });
          EventSource.confirm.resolves();
          confirmButton.simulate('click');
        });

        it('toggles current event\'s confirmation', () => {
          expect(componentWrapper.prop('currentEvent').confirmed).to.be.true();
        });
      });

      context('with unsuccessful request', () => {
        before(() => {
          wrapper.setState({ currentEvent: Event.build({ confirmed: false }) });
          EventSource.confirm.rejects();
          confirmButton.simulate('click');
        });

        it('does not toggle current event\'s confirmation', () => {
          expect(componentWrapper.prop('currentEvent').confirmed).to.be.false();
        });
      });
    });

    function shouldEndEvent(button) {
      context('with successful request', () => {
        before(() => {
          wrapper.setState({ currentEvent: Event.build() });
          EventSource.finish.resolves();
          button.simulate('click');
        });

        it('removes current event', () => {
          expect(componentWrapper.prop('currentEvent')).not.to.exist();
        });
      });

      context('with unsuccessful request', () => {
        const event = Event.build();

        before(() => {
          wrapper.setState({ currentEvent: event });
          EventSource.finish.rejects();
          button.simulate('click');
        });

        it('does not remove current event', () => {
          expect(componentWrapper.prop('currentEvent')).to.equal(event);
        });
      });
    }

    describe('finishing event', () => {
      shouldEndEvent(finishButton);
    });

    describe('canceling event', () => {
      shouldEndEvent(cancelButton);
    });
  });

  describe('creating event', () => {
    const wrapper = mount(<EventProvider conferenceRoom={conferenceRoom} component={DummyComponent} />);
    const createButton = wrapper.find(DummyComponent).find('button#create');
    let clock;
    let currentTime;
    let expectedEvent;

    before(() => {
      EventSource.create.restore();
      currentTime = moment();
      clock = sinon.useFakeTimers(currentTime.valueOf());
      expectedEvent = {
        start_time: currentTime.format(),
        end_time: endTime.format(),
        confirmed: true,
        conference_room_id: conferenceRoom.id,
        summary: 'Anonymous event created by Confy'
      };
      sinon.stub(EventSource, 'create').resolves();
      createButton.simulate('click');
    });

    after(() => {
      EventSource.create.restore();
      clock.restore();
    });

    it('creates event starting at current time', () => {
      expect(EventSource.create).to.have.been.calledOnce();
      expect(EventSource.create).to.have.been.calledWith(expectedEvent);
    });
  });
});
