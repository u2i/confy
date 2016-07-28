import React from 'react';
import Calendar from './calendar/Calendar';
import SideNav from './layout/SideNav';

export default (props) => (
  <div className="container">
    <div className="col-xs-12 col-md-10">
      <SideNav />
      <Calendar {...props} />
    </div>
  </div>
);
