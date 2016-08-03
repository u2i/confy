import React from 'react';
import { Modal } from 'react-bootstrap';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ModalHeader from 'components/modal/layout/ModalHeader';

describe('<ModalHeader />', () => {
  const wrapper = shallow(<ModalHeader />);
  it('renders <Modal.Header />', () => {
    expect(wrapper.find(Modal.Header)).to.have.lengthOf(1);
  });

  it('renders <Modal.Header /> with set closeButton prop to true', () => {
    expect(wrapper.find(Modal.Header).props().closeButton).to.eq(true);
  });

  it('renders <Modal.Title /> inside <Modal.Header />>', () => {
    expect(wrapper.find(Modal.Header).find(Modal.Title)).to.have.lengthOf(1);
  });

  it('renders <Modal.Title /> with "Create event" string inside', () => {
    expect(wrapper.find(Modal.Header).find(Modal.Title).children().text()).to.eq('Create event');
  });
});