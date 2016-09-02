import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import Event from 'test/factories/Event';

import EventContainer from 'components/conference_room/event/EventContainer';

describe('<EventContainer />', () => {
  const DummyComponent = () => <div></div>;

  context('with label prop', () => {
    const label = 'Label';
    const wrapper = shallow(<EventContainer label={label} />);
    it('renders label', () => {
      expect(wrapper.find('h2')).to.have.text(label);
    });
  });

  context('with no event', () => {
    it('doest not render children', () => {
      const wrapper = mount(<EventContainer><DummyComponent /></EventContainer>);
      expect(wrapper).to.not.have.descendants(DummyComponent);
    });

    it('renders noEventLabel', () => {
      const label = 'No events';
      const wrapper = mount(<EventContainer noEventLabel={label} />);
      expect(wrapper).to.contain.text(label);
    });
  });

  context('with event', () => {
    const label = 'No events';
    const event = Event.build();

    it('renders children', () => {
      const wrapper = mount(<EventContainer event={event}><DummyComponent /></EventContainer>);
      expect(wrapper).to.have.exactly(1).descendants(DummyComponent);
    });

    it('does not render noEventLabel', () => {
      const wrapper = mount(<EventContainer event={event} noEventLabel={label}><DummyComponent /></EventContainer>);
      expect(wrapper).to.not.contain(label);
    });
  });
});
