import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import ModalFooter from 'components/modal/layout/ModalFooter';

describe('<ModalFooter />', () => {
  const props = { closeModal: () => {}, saveChanges: () => {} };
  const defaultWrapper = shallow(<ModalFooter {...props} />);
  it('renders <Modal.Footer />', () => {
    expect(defaultWrapper.find(Modal.Footer)).to.have.lengthOf(1);
  });

  it('renders 2 <Button /> inside <Modal.Footer />', () => {
    expect(defaultWrapper.find(Modal.Footer).find(Button)).to.have.lengthOf(2);
  });

  it('renders <Button /> with "Close" string inside', () => {
    expect(defaultWrapper.find(Button).findWhere(node => node.text() === 'Close')).to.have.lengthOf(1);
  });

  it('renders <Button /> with "Save changes" string inside', () => {
    const wrapper = mount(<ModalFooter {...props} />);
    expect(wrapper.find('button.save-button').find('span')).text().to.eq('Save changes');
  });

  context('when hasUnresolvedErrors is true', () => {
    const footerComponent = <ModalFooter hasUnresolvedErrors {...props} />;

    it('renders disabled <Button />', () => {
      const wrapper = shallow(footerComponent);
      expect(wrapper.find('Button.save-button')).prop('disabled').to.be.true();
    });

    it('renders save <Button /> with "Save changes" text', () => {
      const wrapper = mount(footerComponent);
      expect(wrapper.find('button.save-button').find('span')).text().to.eq('Save changes');
    });
  });

  context('when blockWhileSaving is true', () => {
    const footerComponent = <ModalFooter blockWhileSaving {...props} />;

    it('renders disabled <Button />', () => {
      const wrapper = shallow(footerComponent);
      expect(wrapper.find('Button.save-button')).prop('disabled').to.be.true();
    });

    it('renders <Button /> with "Saving..." text', () => {
      const wrapper = mount(footerComponent);
      expect(wrapper.find('button.save-button').find('span')).text().to.eq('Saving...');
    });
  });
});
