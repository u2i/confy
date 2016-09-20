import moment from 'moment';
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';

import { Button } from 'react-bootstrap';
import TimeChoiceButton from 'components/conference_room/layout/controls/new_event/TimeChoiceButton';

describe('<TimeChoiceButton />', () => {
  const duration = moment.duration(30, 'minutes');

  it('renders a <Button /> with human-readable duration', () => {
    const wrapper = shallow(<TimeChoiceButton duration={duration} />);
    expect(wrapper).to.have.exactly(1).descendants(Button);
    expect(wrapper.html()).to.contain('30 minutes');
  });

  context('with no next event', () => {
    const wrapper = shallow(<TimeChoiceButton duration={duration} />);

    it('is always enabled', () => {
      expect(wrapper.find(Button)).to.have.prop('disabled').equal(false);
    });
  });

  context('with next event', () => {
    context('starting more than duration prop from now', () => {
      const nextEventStart = moment().add(1, 'hour');
      const wrapper = shallow(<TimeChoiceButton duration={duration} nextEventStart={nextEventStart} />);

      it('is enabled', () => {
        expect(wrapper.find(Button)).to.have.prop('disabled').equal(false);
      });
    });

    context('starting less than duration prop from now', () => {
      const nextEventStart = moment().add(15, 'minutes');
      const wrapper = shallow(<TimeChoiceButton duration={duration} nextEventStart={nextEventStart} />);

      it('is disabled', () => {
        expect(wrapper.find(Button)).to.have.prop('disabled').equal(true);
      });
    });

    context('with passing time', () => {
      const nextEventStart = moment(0).add(moment.duration(31, 'minutes'));
      const wrapper = shallow(<TimeChoiceButton duration={duration} nextEventStart={nextEventStart} />);
      let clock;

      before(() => {
        clock = sinon.useFakeTimers(0);
      });

      after(() => {
        clock.restore();
      });

      it('gets disabled', () => {
        clock.tick(moment.duration({ minutes: 1, seconds: 1 }).valueOf());
        expect(wrapper.find(Button)).to.have.prop('disabled').equal(true);
      });
    });
  });
});
