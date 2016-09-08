import React from 'react';
import Event from 'test/factories/Event';
import { shallow } from 'enzyme';
import { expect } from 'chai';

import EventSummary from 'components/calendar/event/details/EventSummary';

describe('<EventSummary />', () => {
  const summary = 'Summary';
  const event = Event.build({ summary });
  const wrapper = shallow(<EventSummary event={event} />);

  it('renders event summary', () => {
    expect(wrapper).to.have.text(summary);
  });
});
