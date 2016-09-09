import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

import App from './App';

const wrapComponent = (Component, railsProps) => class extends React.Component {
  static childContextTypes = {
    userEmail: React.PropTypes.string
  };

  getChildContext() {
    return {userEmail: railsProps.userEmail};
  }

  render() {
    const { userEmail: _, ...ownProps } = railsProps;
    return (<Component {...ownProps} {...this.props} />);
  }
};

export default (props) => (
  <Router history={browserHistory}>
    <Route path="/(:date)" component={wrapComponent(App, props)}/>
  </Router>
);
