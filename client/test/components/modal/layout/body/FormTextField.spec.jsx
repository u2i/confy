import React from 'react';
import { ControlLabel, FormControl } from 'react-bootstrap';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import FormTextField from 'components/modal/layout/body/FormTextField';

describe('<FormTextField />', () => {
  const onChangeSpy = sinon.spy();
  const label = "summary";

  it('renders <ControlLabel />', () => {
    const wrapper =
      shallow(<FormTextField  name={label} onChange={onChangeSpy} />);
    expect(wrapper.find(ControlLabel)).to.exist;
  });

  it('renders <ControlLabel /> with capitalized name prop', () => {
    const wrapper =
      mount(<FormTextField  name={label} onChange={onChangeSpy} />);
    expect(wrapper.find(ControlLabel)).to.have.text("Summary:");
  });

  it('renders <FormControl /> text input', () => {
    const wrapper =
      shallow(<FormTextField  name={label} onChange={onChangeSpy} />);
    expect(wrapper.find(FormControl)).to.exist;
  });

  it('invokes handler on input', () => {
    const wrapper =
      mount(<FormTextField  name={label} onChange={onChangeSpy} />);
    wrapper.find(FormControl).simulate('change', { target: { value: 'test' } });
    expect(onChangeSpy).to.have.been.calledOnce();
  });
});
