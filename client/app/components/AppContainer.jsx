import React from 'react'
import EventSource from 'sources/EventSource';

import Calendar from './calendar/Calendar'
import SideNav from './SideNav'

export default class AppContainer extends React.Component {
  static propTypes = {
    initialEvents: React.PropTypes.array
  };

  constructor(...args) {
    super(...args);

    this.state = { events: this.props.initialEvents };
    this.handleCalendarRefresh = this.handleCalendarRefresh.bind(this);
  }

  componentDidMount() {
    if (!this.state.events) {
      this._fetchEvents();
    }
  }

  handleCalendarRefresh() {
    this._fetchEvents();
  }

  render() {
    const { initialEvents, ...calendarProps } = this.props;
    return (
      <div className="container">
        <div className="col-xs-12 col-md-10">
          <SideNav onRefresh={this.handleCalendarRefresh}/>
          <Calendar {...calendarProps} events={this.state.events} />
        </div>
      </div>
    )
  }

  _fetchEvents() {
    this.setState({ events: EventSource.fetch() });
  }
}
