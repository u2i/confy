import React from 'react';
import { Radio } from 'react-bootstrap';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import RecurrenceComponent from 'components/calendar/modal/layout/body/RecurrenceComponent';
import sinon from 'sinon';

describe('<RecurrenceComponent />', () => {
  const onChange = sinon.spy();
  const wrapper = mount(<RecurrenceComponent onChange={onChange}/>);

  it('renders <Radio /> for each recurrence option', () => {
    expect(wrapper.find('Radio')).to.have.lengthOf(5);
  });

  it('renders <Radio />  with "none" value initiallty checked', () => {
    const noneRadio = wrapper.find('Radio').filterWhere(node => node.prop('value') === 'none');

    expect(noneRadio.props().checked).to.eq(true);
  });

  it('renders remaining <Radio /> initially unchecked', () => {
    const remainingRadios = wrapper.find('Radio').filterWhere(node => node.prop('value') !== 'none');

    remainingRadios.forEach(radio => {
      expect(radio.props().checked).to.eq(false);
    })
  });
});
