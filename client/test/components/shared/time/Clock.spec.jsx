import moment from 'moment';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import Clock from 'components/shared/time/Clock';

describe('<Clock />', () => {
  let clock;
  const dateFormat = 'YYYY-MM-DD';
  const timeFormat = ' HH:mm';
  const time = moment([2016, 0, 1, 0, 0]).valueOf();

  before(() => {
    clock = sinon.useFakeTimers(time);
  });

  after(() => {
    clock.restore();
  });

  it('displays current time', () => {
    const wrapper = shallow(<Clock dateFormat={dateFormat} timeFormat={timeFormat} />);
    expect(wrapper).to.have.text('2016-01-01 00:00');
  });

  it('updates time', () => {
    const wrapper = mount(<Clock dateFormat={dateFormat} timeFormat={timeFormat} />);
    clock.tick(1000 * 60);
    expect(wrapper).to.have.text('2016-01-01 00:01');
  });
});
