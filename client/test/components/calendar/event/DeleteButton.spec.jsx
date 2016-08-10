import React from 'react';
import { shallow, mount } from 'enzyme';
import DeleteButton from 'components/calendar/event/DeleteButton';
import { expect } from 'chai';
import sinon from 'sinon';
import { Overlay } from 'react-bootstrap';

describe('<DeleteButton />', () => {
  let spy;
  beforeEach(() => {
    spy = sinon.spy();
  });

  it('renders', () => {
    const wrapper = mount(<DeleteButton onDelete={spy} disabled={false} />);
    expect(wrapper.find('span').props().className).to.contain('delete-button');
    expect(wrapper.find('span').props().className).to.contain('glyphicon');
  });

  describe('overlay', () => {
    context('props.disabled', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = mount(<DeleteButton onDelete={spy} disabled />);
      });

      it('does not have a confirmation box', () => {
        expect(wrapper.find(Overlay).prop('className')).to.contain('destroy-info-overlay');
      });
    });

    context('props.disabled === false', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = mount(<DeleteButton onDelete={spy} disabled={false} />);
      });

      it('has a confirmation box', () => {
        expect(wrapper.find(Overlay).prop('className')).to.contain('confirmation-overlay');
      });
    });
  });
});
