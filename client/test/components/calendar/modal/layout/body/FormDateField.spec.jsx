import React from 'react';
import { ControlLabel } from 'react-bootstrap';
import DateTimeField from 'react-bootstrap-datetimepicker';
import sinon from 'sinon';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import FormDateField from 'components/calendar/modal/layout/body/FormDateField';
import DateRangePicker from 'components/shared/time/datepicker/DateRangePicker';

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

  it('invokes onChange handler on DateRange', () => {
    const wrapper =
      mount(<FormDateField label={"DateLabel"} onChange={onChangeSpy} />);
    wrapper.find(DateRangePicker).simulate('change');
    expect(onChangeSpy).to.be.called();
  });
});
