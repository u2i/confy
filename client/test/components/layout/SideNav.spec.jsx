import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import { Button } from 'react-bootstrap';
import SideNav from '../../../app/components/layout/SideNav';

describe('<SideNav />', () => {
  const refreshSpy = sinon.spy();
  const date = moment().format('YYYY-MM-DD');

  it('should render five <Button /> elements', () => {
    const wrapper = shallow(<SideNav onRefresh={refreshSpy} date={date} />);
    expect(wrapper.find(Button)).to.have.lengthOf(5);
  });

  it('invokes callback on refresh', () => {
    const wrapper = shallow(<SideNav onRefresh={refreshSpy} date={date} />);
    wrapper.find(Button).forEach(button => button.simulate('click'));
    expect(refreshSpy).to.have.been.calledOnce();
  });
});
