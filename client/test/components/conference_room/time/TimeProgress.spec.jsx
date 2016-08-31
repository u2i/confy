import moment from 'moment';
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

const DummyCircle = () => <div></div>;

const TimeProgress = proxyquire('../../../../app/components/conference_room/time/TimeProgress', {
  'react-progressbar.js': {
    Circle: DummyCircle
  }
}).default;

describe('<TimeProgress />', () => {
  let clock;
  const start = moment([2016, 0, 1, 0, 0, 0]);
  const end = start.clone().add(2, 'hours');

  const element = <TimeProgress start={start.unix()}
                                end={end.unix()}
                                onCompleted={sinon.spy()}
                                updateInterval={1000 * 60} />;

  before(() => {
    clock = sinon.useFakeTimers(start.valueOf());
  });

  beforeEach(() => {
    clock.restore();
    clock = sinon.useFakeTimers(start.valueOf());
  });

  after(() => {
    clock.restore();
  });

  it('renders <Circle /> progress bar', () => {
    const wrapper = shallow(element);
    expect(wrapper).to.have.exactly(1).descendants(DummyCircle);
  });

  context('progress bar', () => {
    it('starts with 100% progress', () => {
      const wrapper = mount(element);
      expect(wrapper.find(DummyCircle)).to.have.prop('progress').equal(1);
    });

    it('decreases with time', () => {
      const wrapper = mount(element);
      clock.tick(1000 * 60 * 24);
      expect(wrapper.find(DummyCircle)).to.have.prop('progress').equal(0.8);
    });
  });

  context('timer', () => {
    it('displays time left to end of event', () => {
      const wrapper = shallow(element);
      wrapper.setState({ progress: 1 });
      expect(wrapper.find(DummyCircle)).to.have.prop('text').contain('02:00:00');
    });

    it('updates with time', () => {
      const wrapper = mount(element);
      clock.tick(1000 * 60);
      expect(wrapper.find(DummyCircle)).to.have.prop('text').contain('01:59:00');
    });
  });
});
