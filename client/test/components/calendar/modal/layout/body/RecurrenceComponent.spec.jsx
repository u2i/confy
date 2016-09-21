import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import RecurrenceComponent from 'components/calendar/modal/layout/body/RecurrenceComponent';
import sinon from 'sinon';

describe('<RecurrenceComponent />', () => {
  const onChange = sinon.spy();
  const mountRecurrenceWrapper = () => mount(<RecurrenceComponent onChange={onChange} />);
  const shallowRecurrenceWrapper = () => shallow(<RecurrenceComponent onChange={onChange} />);
  let wrapper;

  it('renders <Radio /> for each recurrence option', () => {
    wrapper = shallowRecurrenceWrapper();
    expect(wrapper.find('Radio')).to.have.lengthOf(5);
  });

  it('renders <Radio />  with "none" value initially checked', () => {
    wrapper = shallowRecurrenceWrapper();
    const noneRadio = wrapper.find('Radio').filterWhere(node => node.prop('value') === 'none');

    expect(noneRadio.props().checked).to.eq(true);
  });

  it('renders remaining <Radio /> initially unchecked', () => {
    wrapper = shallowRecurrenceWrapper();
    const remainingRadios = wrapper.find('Radio').filterWhere(node => node.prop('value') !== 'none');

    remainingRadios.forEach(radio => {
      expect(radio.props().checked).to.eq(false);
    });
  });

  context('invoked change event on <Radio />', () => {
    wrapper = mountRecurrenceWrapper();
    const recurrenceOption = 'daily';
    const recurrenceRadio = wrapper.find('Radio').filterWhere(node => node.prop('value') === recurrenceOption);

    it('calls onChange prop with <Radio /> value', () => {
      recurrenceRadio.find('input[type="radio"]').simulate('change');
      expect(onChange.calledWith(recurrenceOption)).to.eq(true);
    });
  });
});
