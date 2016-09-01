import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import CalendarContainer from './CalendarContainer';

const wrapComponent = (Component, ownProps) => (props) => (
  <Component {...ownProps} {...props} />
);

export default (props) => (
  <Router history={browserHistory}>
    <Route path="/(:date)" component={wrapComponent(CalendarContainer, props)} />
  </Router>
);
