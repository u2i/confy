import React from 'react';
import SideCalendar from  'components/calendar/layout/SideCalendar';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

describe('<SideCalendar />', () => {
  const spy = sinon.spy();
  const routerContext = { router: spy };
  const wrapper = shallow(<SideCalendar />, { context: routerContext });
  
  describe('_routeToSelectedDate()', () => {
    
  });
});