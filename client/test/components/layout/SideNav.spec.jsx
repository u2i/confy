import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { Button } from 'react-bootstrap';
import SideNav from '../../../app/components/layout/SideNav';

describe('<SideNav />', () => {
  const refreshSpy = sinon.spy();

  it('invokes callback on refresh', () => {
    const wrapper = shallow(<SideNav onRefresh={refreshSpy} />);
    wrapper.find(Button).forEach(button => button.simulate('click'));
    expect(refreshSpy).to.have.been.calledOnce;
  });
});
