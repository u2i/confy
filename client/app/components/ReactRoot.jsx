import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import App from './App';

const wrapComponent = (Component, ownProps) => (props) => (
  <Component {...ownProps} {...props} />
);

export default (props) => (
  <Router history={browserHistory}>
    <Route path="/(:date)" component={wrapComponent(App, props)} />
  </Router>
);
