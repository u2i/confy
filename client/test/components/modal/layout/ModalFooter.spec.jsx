import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import ModalFooter from 'components/modal/layout/ModalFooter';

describe('<ModalFooter />', () => {
  const props = { closeModal: () => {}, saveChanges: () => {}};
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

  context('when unresolvedErrors is true', () => {
    const footerComponent = <ModalFooter unresolvedErrors={true} {...props} />;

    it('renders disabled <Button />', () => {
      const wrapper = shallow(footerComponent);
      expect(wrapper.find('Button.save-button')).prop('disabled').to.be.true();
    });

    it('renders save <Button /> with "Save changes" text', () => {
      const wrapper = mount(footerComponent);
      expect(wrapper.find('button.save-button').find('span')).text().to.eq('Save changes');
    })
  });

  context('when blockWhileSaving is true', () => {
    const footerComponent = <ModalFooter blockWhileSaving={true} {...props} />;

    it('renders disabled <Button />', () => {
      const wrapper = shallow(footerComponent);
      expect(wrapper.find('Button.save-button')).prop('disabled').to.be.true();
    });

    it('renders <Button /> with "Saving..." text', () => {
      const wrapper = mount(footerComponent);
      expect(wrapper.find('button.save-button').find('span')).text().to.eq('Saving...');
    })
  });
});
