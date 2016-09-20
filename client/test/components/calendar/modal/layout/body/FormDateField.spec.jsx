/* eslint-disable react/prop-types */
import React from 'react';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import RequiredFieldLabel from 'components/calendar/modal/layout/body/RequiredFieldLabel';

const DummyDatePicker = ({ onChange }) => <input onChange={onChange} id="picker" />;

const FormDateField = proxyquire
  .noCallThru()
  .load('../../../../../../app/components/calendar/modal/layout/body/FormDateField', {
    '../../../../shared/time/datepicker/DateRangePicker': DummyDatePicker
  }).default;

describe('<FormDateField />', () => {
  const onChangeSpy = sinon.spy();

  it('renders <ControlLabel />', () => {
    const wrapper =
      shallow(<FormDateField label={"DateLabel"} onChange={onChangeSpy} />);
    expect(wrapper.find(RequiredFieldLabel)).to.exist();
  });

  it('renders <ControlLabel /> with label prop as text', () => {
    const wrapper =
      mount(<FormDateField label={"DateLabel"} onChange={onChangeSpy} />);
    expect(wrapper.find(RequiredFieldLabel)).to.have.text('DateLabel:');
  });

  it('renders <DateRangePicker />', () => {
    const wrapper =
      shallow(<FormDateField label={"DateLabel"} onChange={onChangeSpy} />);
    expect(wrapper.find(DummyDatePicker)).to.exist();
  });

  it('invokes onChange handler on DateRange', () => {
    const wrapper =
      mount(<FormDateField label={"DateLabel"} onChange={onChangeSpy} />);
    wrapper.find('input#picker').simulate('change');
    expect(onChangeSpy).to.be.called();
  });
});
