import moment from 'moment';
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import TimeProgress from 'components/shared/time/TimeProgress';

describe('<TimeProgress />', () => {
  let clock;
  const start = moment([2016, 0, 1, 0, 0, 0]);
  const end = start.clone().add(2, 'hours');

  const element = ({ onCompleted, suffix } = {}) => <TimeProgress end={end}
                                                          suffix={suffix}
                                                          onCompleted={onCompleted || sinon.spy()}
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

  context('timer', () => {
    it('displays time left to end of event', () => {
      const wrapper = shallow(element());
      wrapper.setState({ progress: 1 });
      expect(wrapper).to.have.text('2 hours left');
    });

    it('updates with time', () => {
      const wrapper = mount(element());
      clock.tick(1000 * 60 * 80);
      expect(wrapper).to.have.text('40 minutes left');
    });
  });

  it('invokes onCompleted callback when time is up', () => {
    const onCompleted = sinon.spy();
    mount(element({ onCompleted }));
    clock.tick(1000 * 60 * 60 * 2);
    expect(onCompleted).to.have.been.calledOnce();
  });

  context('with suffix', () => {
    it('renders suffix after time', () => {
      const suffix = 'to next event';
      const wrapper = shallow(element({ suffix }));
      expect(wrapper).to.have.text('2 hours to next event');
    });
  });
});
