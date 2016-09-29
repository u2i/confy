import React from 'react';
import { mount } from 'enzyme';
import EventDestroyer from 'components/calendar/event/EventDestroyer';
import DeleteConfirmation from 'components/calendar/event/DeleteConfirmation';
import { expect } from 'chai';
import sinon from 'sinon';
import { Overlay, Modal } from 'react-bootstrap';
import EventFactory from 'test/factories/Event';
import DeleteButton from 'components/calendar/event/DeleteButton';

describe('<EventDestroyer />', () => {
  let spy;
  const defaultEvent = EventFactory.build();

  beforeEach(() => {
    spy = sinon.spy();
  });

  it('renders', () => {
    const wrapper = mount(<EventDestroyer onDelete={spy} disabled={false} event={defaultEvent} />);
    expect(wrapper.find('span').props().className).to.contain('delete-button');
    expect(wrapper.find('span').props().className).to.contain('glyphicon');
  });

  describe('overlay', () => {
    let wrapper;

    before(() => {
      wrapper = mount(<EventDestroyer onDelete={spy} disabled={false} event={defaultEvent} />);
    });

    it('has a confirmation box', () => {
      expect(wrapper.find(Overlay)).not.to.be.present();
      expect(wrapper.find(Modal)).to.have.lengthOf(1);
    });
  });

  describe('<DeleteButton /> onClick', () => {
    const event = EventFactory.build();
    const wrapper = mount(<EventDestroyer event={event} onDelete={sinon.spy()} />);

    it('initially does not show <DeleteConfirmation />', () => {
      expect(wrapper.find(DeleteConfirmation).prop('show')).to.eq(false);
    });

    context('after DeleteButton onClick', () => {
      before(() => {
        wrapper.find(DeleteButton).simulate('click');
      });

      it('shows <DeleteConfirmation />', () => {
        expect(wrapper.find(DeleteConfirmation).prop('show')).to.eq(true);
      });
    });
  });
});
