import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import moment from 'moment';

import { Button } from 'react-bootstrap';
import SideNav from '../../../app/components/layout/SideNav';
import RefreshButton from '../../../app/components/layout/RefreshButton';

describe('<SideNav />', () => {
  const onRefresh = sinon.spy();
  const date = moment().format('YYYY-MM-DD');

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<SideNav date={date} />);
    onRefresh.reset();
  });

  it('should render four <Button /> elements', () => {
    expect(wrapper).to.have.exactly(4).descendants(Button);
  });

  it('should render a <RefreshButton />', () => {
    expect(wrapper).to.have.exactly(1).descendants(RefreshButton);
  });
});
