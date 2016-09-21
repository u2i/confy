import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import EventFactory from 'test/factories/Event';
import { MAX_DESCRIPTION_LENGTH } from 'helpers/EventHelper';
import EventAdditionalDetails from 'components/calendar/event/details/EventAdditionalDetails';
import EventFullDescription from 'components/calendar/event/details/EventFullDescription';
import EventExpandableDescription from 'components/calendar/event/details/EventExpandableDescription';

describe('<EventAdditionalDetails />', () => {
  const buildEvent = (description) => EventFactory.build({ description });
  const mountComponent = (event) => mount(<EventAdditionalDetails event={event} />);

  context('with description shorter than EventHelper.MAX_DESCRIPTION_LENGTH', () => {
    const shortDescription = 'a'.repeat(MAX_DESCRIPTION_LENGTH - 1);
    const event = buildEvent(shortDescription);

    it('renders <EventFullDescription />', () => {
      const wrapper = mountComponent(event);

      expect(wrapper.find(EventFullDescription)).to.exist();
    });
  });

  context('with description longer than EventHelper.MAX_DESCRIPTION_LENGTH', () => {
    const longDescription = 'a'.repeat(MAX_DESCRIPTION_LENGTH + 1);
    const event = buildEvent(longDescription);

    it('renders <EventExpandableDescription />', () => {
      const wrapper = mountComponent(event);

      expect(wrapper.find(EventExpandableDescription)).to.exist();
    });
  });
});
