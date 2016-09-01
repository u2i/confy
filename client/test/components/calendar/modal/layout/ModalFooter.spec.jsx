import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ModalFooter from 'components/calendar/modal/layout/ModalFooter';

describe('<ModalFooter />', () => {
  const props = { closeModal: () => {}, saveChanges: () => {}, disableSaving: false };
  const wrapper = shallow(<ModalFooter {...props} />);
  it('renders <Modal.Footer />', () => {
    expect(wrapper.find(Modal.Footer)).to.have.lengthOf(1);
  });

  it('renders 2 <Button /> inside <Modal.Footer />', () => {
    expect(wrapper.find(Modal.Footer).find(Button)).to.have.lengthOf(2);
  });

  it('renders <Button /> with "Close" string inside', () => {
    expect(wrapper.find(Button).findWhere(node => node.text() === 'Close')).to.have.lengthOf(1);
  });

  it('renders <Button /> with "Save changes" string inside', () => {
    expect(wrapper.findWhere(node => node.type() === 'span' && node.text() === 'Save changes')).to.have.lengthOf(1);
  });
});
