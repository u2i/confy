import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { Button } from 'react-bootstrap';

import ToggleableControls from 'components/conference_room/layout/controls/new_event/ToggleableControls';
import TimeChoiceButton from 'components/conference_room/layout/controls/new_event/TimeChoiceButton';

describe('<ToggleableControls />', () => {
  const toggleText = 'Toggle';

  function shouldRenderToggleButton(wrapper) {
    const button = wrapper.find(Button);

    it('renders toggle <Button />', () => {
      expect(button).to.have.lengthOf(1);
      expect(button).to.have.text(toggleText)
    });
  }

  function shouldRenderTimeButtons(wrapper) {
    it('renders <EventTimeControls />', () => {
      expect(wrapper).to.have.descendants(TimeChoiceButton);
    });

    it('renders cancel <Button />', () => {
      const button = wrapper.find(Button);
      expect(button).to.have.lengthOf(1);
      expect(button).to.have.text('Cancel');
    });
  }

  describe('initial state', () => {
    const child = 'Child';
    const wrapper = mount(<ToggleableControls toggleText={toggleText}>{child}</ToggleableControls>);

    shouldRenderToggleButton(wrapper);

    context('with children', () => {
      it('renders children', () => {
        expect(wrapper.html()).to.contain(child);
      });
    });
  });

  describe('on toggle', () => {
    const child = 'Child';
    let wrapper;

    beforeEach(() => {
      wrapper = mount(<ToggleableControls toggleText={toggleText}>{child}</ToggleableControls>);
      wrapper.find('button').simulate('click');
    });

    it('', () => shouldRenderTimeButtons(wrapper));

    context('with children', () => {
      it('does not render children', () => {
        expect(wrapper.html()).not.to.contain(child);
      });
    });

    describe('on control click', () => {
      beforeEach(() => {
        wrapper.find(TimeChoiceButton).first().find('button').simulate('click');
      });

      it('', () => shouldRenderToggleButton(wrapper));
    });

    describe('on cancel click', () => {
      beforeEach(() => {
        wrapper.find('button').findWhere(button => button.text() === 'Cancel').simulate('click');
      });

      it('', () => shouldRenderToggleButton(wrapper));
    });
  });
});
