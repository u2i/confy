import React from 'react';
import { ControlLabel } from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import FormDateField from 'components/calendar/modal/layout/body/FormDateField';

describe('<FormDateField />', () => {
  const onChangeSpy = sinon.spy();

  it('renders <ControlLabel />', () => {
    const wrapper =
      shallow(<FormDateField label={"DateLabel"} onChange={onChangeSpy} />);
    expect(wrapper.find(ControlLabel)).to.exist;
  });

  it('renders <ControlLabel /> with label prop as text', () => {
    const wrapper =
      mount(<FormDateField label={"DateLabel"} onChange={onChangeSpy} />);
    expect(wrapper.find(ControlLabel)).to.have.text('DateLabel:');
  });

  it('renders <DateTimeField />', () => {
    const wrapper =
      shallow(<FormDateField label={"DateLabel"} onChange={onChangeSpy} />);
    expect(wrapper.find(DateTimeField)).to.exist;
  });

  it('invokes onChange handler on input', () => {
    const wrapper =
      mount(<FormDateField label={"DateLabel"} onChange={onChangeSpy} />);
    wrapper.find('input').simulate('change', { target: { value: '01/01/2016 20:30' } });
    expect(onChangeSpy).to.be.calledOnce();
  });

  it('returns error for invalid date', () => {
    const wrapper =
      mount(<FormDateField label={"DateLabel"} onChange={onChangeSpy} />);
    wrapper.find('input').simulate('change', { target: { value: '01/01/2016' } });
    expect(onChangeSpy).to.be.calledWith('Invalid date');
  });
});
