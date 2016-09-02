import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import { Button, Glyphicon } from 'react-bootstrap';

import HelpButton from 'components/conference_room/help/HelpButton';

describe('<HelpButton />', () => {
  const onClick = sinon.spy();
  const wrapper = shallow(<HelpButton onClick={onClick} />);

  it('renders a <Button />', () => {
    expect(wrapper).to.have.exactly(1).descendants(Button);
  });

  it('renders a <Glyphicon /> with question mark', () => {
    expect(wrapper.find(Glyphicon)).to.have.prop('glyph').equal('question-sign');
  });

  it('invokes callback on click', () => {
    wrapper.find(Button).simulate('click');
    expect(onClick).to.have.been.calledOnce();
  });
});
