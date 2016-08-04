import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ModalFooter from 'components/modal/layout/ModalFooter';

describe('<ModalFooter />', () => {
  const props = { closeModal: () => {}, saveChanges: () => {} };
  const wrapper = shallow(<ModalFooter {...props} />);
  it('renders <Modal.Footer />', () => {
    expect(wrapper.find(Modal.Footer)).to.have.lengthOf(1);
  });
  
  it('renders 2 <Button /> inside <Modal.Footer />', () => {
    expect(wrapper.find(Modal.Footer).find(Button)).to.have.lengthOf(2);
  });

  it('renders <Button /> with "Close" string inside', () => {
    expect(wrapper.find(Button).findWhere(n => n.text() === "Close")).to.have.lengthOf(1);
  });

  it('renders <Button /> with "Save changes" string inside', () => {
    expect(wrapper.find(Button).findWhere(n => n.text() === "Save changes")).to.have.lengthOf(1);
  });
});