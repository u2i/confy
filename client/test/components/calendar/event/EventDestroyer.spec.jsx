import React from 'react';
import { shallow, mount } from 'enzyme';
import EventDestroyer from 'components/calendar/event/EventDestroyer';
import { expect } from 'chai';
import sinon from 'sinon';
import { Overlay, Modal } from 'react-bootstrap';

describe('<EventDestroyer />', () => {
  let spy;
  beforeEach(() => {
    spy = sinon.spy();
  });

  it('renders', () => {
    const wrapper = mount(<EventDestroyer onDelete={spy} disabled={false} />);
    expect(wrapper.find('span').props().className).to.contain('delete-button');
    expect(wrapper.find('span').props().className).to.contain('glyphicon');
  });

  describe('overlay', () => {
    context('props.disabled', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = mount(<EventDestroyer onDelete={spy} disabled />);
      });

      it('has information overlay', () => {
        expect(wrapper.find(Overlay).prop('className')).to.contain('destroy-info-overlay');
        expect(wrapper.find(Modal)).not.to.be.present();
      });
    });

    context('props.disabled === false', () => {
      let wrapper;
      beforeEach(() => {
        wrapper = mount(<EventDestroyer onDelete={spy} disabled={false} />);
      });

      it('has a confirmation box', () => {
        expect(wrapper.find(Overlay)).not.to.be.present();
        expect(wrapper.find(Modal)).to.have.lengthOf(1);
      });
    });
  });
});
