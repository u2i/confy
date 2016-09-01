import React from 'react';
import { Alert } from 'react-bootstrap';
import { mount } from 'enzyme';
import { expect } from 'chai';
import ErrorField from 'components/calendar/modal/layout/ErrorField';

describe('<ErrorField />', () => {
  it('does not render <Alert /> by default', () => {
    const wrapper = mount(<ErrorField />);
    expect(wrapper.find(Alert)).to.not.exist;
  });

  it('renders <Alert /> if showErrorMessage is true', () => {
    const wrapper = mount(<ErrorField showErrorMessage />);
    expect(wrapper.find(Alert)).to.exist;
  });

  it('does not render <Alert /> if showErrorMessage is false', () => {
    const wrapper = mount(<ErrorField showErrorMessage={false} />);
    expect(wrapper.find(Alert)).to.not.exist;
  });
});
