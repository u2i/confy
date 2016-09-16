import React from 'react';
import { ControlLabel } from 'react-bootstrap';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import proxyquire from 'proxyquire';

const DummyDatePicker = ({ onChange }) =>
  <input onChange={onChange} id="picker" />; // eslint-disable-line react/prop-types
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
    expect(wrapper.find(ControlLabel)).to.exist();
  });

  it('renders <ControlLabel /> with label prop as text', () => {
    const wrapper =
      mount(<FormDateField label={"DateLabel"} onChange={onChangeSpy} />);
    expect(wrapper.find(ControlLabel)).to.have.text('DateLabel:');
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
