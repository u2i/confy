import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import proxyquire from 'proxyquire';
import { Modal, Button } from 'react-bootstrap';

const helpText = 'This is very helpful';

const Help = proxyquire('../../../../app/components/conference_room/help/Help', {
  '../texts/help.md': helpText
}).default;

describe('<Help />', () => {
  const helpWrapper = shallow(<Help />);

  it('renders <Modal />', () => {
    expect(helpWrapper).to.have.exactly(1).descendants(Modal);
  });

  it('renders <Help.Header />', () => {
    expect(helpWrapper).to.have.exactly(1).descendants(Help.Header);
  });

  it('renders <Help.Body /> ', () => {
    expect(helpWrapper).to.have.exactly(1).descendants(Help.Body);
  });

  it('renders <Help.Footer />', () => {
    expect(helpWrapper).to.have.exactly(1).descendants(Help.Footer);
  });

  describe('<Help.Body />', () => {
    const wrapper = shallow(<Help.Body />);

    it('renders help text', () => {
      expect(wrapper.html()).to.contain(helpText);
    });
  });

  describe('<Help.Footer />', () => {
    const onHide = sinon.spy();
    const wrapper = shallow(<Help.Footer onHide={onHide} />);

    it('renders close <Button />', () => {
      expect(wrapper).to.have.exactly(1).descendants(Button);
      expect(wrapper.find(Button).html()).to.contain('Close');
    });

    it('invokes onHide callback', () => {
      wrapper.find(Button).simulate('click');
      expect(onHide).to.have.been.calledOnce();
    });
  });
});
