import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import { Button, Glyphicon } from 'react-bootstrap';
import RefreshButton from '../../../app/components/layout/RefreshButton';

describe('<RefreshButton />', () => {
  const refreshSpy = sinon.spy();

  it('invokes callback on refresh', () => {
    const wrapper = shallow(<RefreshButton onRefresh={refreshSpy} />);
    wrapper.find(Button).simulate('click');
    expect(refreshSpy).to.have.been.calledOnce();
  });

  it('renders icon with .spin class when animated', () => {
    const wrapper = shallow(<RefreshButton animate />);
    expect(wrapper.find(Glyphicon)).to.have.className('spin');
  });
});
