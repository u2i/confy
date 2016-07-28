import React from 'react';
import Calendar from './calendar/Calendar';
import SideNav from './layout/SideNav';

export default class AppContainer extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="col-xs-12 col-md-10">
          <SideNav />
          <Calendar {...this.props} />
        </div>
      </div>
    );
  }
}
