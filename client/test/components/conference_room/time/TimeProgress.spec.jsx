import moment from 'moment';
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import TimeProgress from 'components/conference_room/time/TimeProgress';
import { Circle } from 'react-progressbar.js';

describe('<TimeProgress />', () => {
  let clock;
  const start = moment([2016, 0, 1, 0, 0, 0]);
  const end = start.clone().add(2, 'hours');

  const shallowWrapper = () => shallow(<TimeProgress start={start.unix()} end={end.unix()} />);

  before(() => {
    clock = sinon.useFakeTimers(start.valueOf());
  });

  after(() => {
    clock.restore();
  });

  it('renders <Circle /> progress bar', () => {
    const wrapper = shallowWrapper();
    expect(wrapper).to.have.exactly(1).descendants(Circle);
  });

  it('displays time left to end of event', () => {
    const wrapper = shallowWrapper();
    wrapper.setState({ progress: 1 });
    expect(wrapper.find(Circle)).to.have.prop('text').contain('02:00:00');
  });
});
