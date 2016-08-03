import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import ModalFooter from 'components/modal/layout/ModalFooter';

describe('<ModalFooter />', () => {
  const wrapper = shallow(<ModalFooter />);
  it('renders <Modal.Footer />', () => {
    expect(wrapper.find(Modal.Footer)).to.have.lengthOf(1);
  });
  
  it('renders 2 <Button /> inside <Modal.Footer />', () => {
    expect(wrapper.find(Modal.Footer).find(Button)).to.have.lengthOf(2);
  });
});