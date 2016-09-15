import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { MAX_DESCRIPTION_LENGTH } from 'helpers/EventHelper';
import EventExpandableDescription from 'components/calendar/event/details/EventExpandableDescription';

describe('<EventExpandableDescription />', () => {
  const description = 'a'.repeat(MAX_DESCRIPTION_LENGTH + 10);
  const defaultWrapper = () => mount(<EventExpandableDescription description={description} />);

  context('expansionMessage', () => {
    const subject = defaultWrapper().find('a');

    it('initially renders "More"', () => {
      expect(subject).to.have.text(' More');
    });

    it('renders "Less" after click on <a>', () => {
      subject.simulate('click');

      expect(subject).to.have.text(' Less');
    });
  });

  context('descriptionContent', () => {
    const wrapper = defaultWrapper();
    const subject = wrapper.find('p');

    it('initially renders shortened description', () => {
      const shortenedDescription = `${description.slice(0, MAX_DESCRIPTION_LENGTH)}...`;

      expect(subject).to.have.text(shortenedDescription);
    });

    it('renders full description after clicking on <a>', () => {
      wrapper.find('a').simulate('click');

      expect(subject).to.have.text(description);
    });
  });
});
