import moment from 'moment';
import React from 'react';
import { Button } from 'react-bootstrap';

import RefreshButton from './RefreshButton';

export default class SideNav extends React.Component {
  static propTypes = {
    date:      React.PropTypes.string.isRequired,
    onRefresh: React.PropTypes.func,
    updating:  React.PropTypes.bool,
    openModal: React.PropTypes.func.isRequired
  };

  constructor() {
    super();

    this._handleCreateEvent = this._handleCreateEvent.bind(this);
  }

  render() {
    return (
      <aside className="sidebar">
        <Button bsStyle="primary" className="btn-block"
                onClick={this._handleCreateEvent}>
          Create Event
        </Button>
        <Button href={"/"}
                className="btn-block">Home</Button>
        <Button href={this._dateParam(this._nextWeek())}
                className="btn-block">Next Week</Button>
        <Button href={this._dateParam(this._previousWeek())}
                className="btn-block">Previous Week</Button>
        <RefreshButton onRefresh={this.props.onRefresh} animate={this.props.updating} />
      </aside>
    );
  }

  _nextWeek() {
    return moment(this.props.date).add(1, 'weeks');
  }

  _previousWeek() {
    return moment(this.props.date).subtract(1, 'weeks');
  }

  _dateParam(date) {
    return `/?date=${date.format('YYYY-MM-DD')}`;
  }

  _handleCreateEvent() {
    this.props.openModal();
  }
}
