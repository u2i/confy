import React from 'react';
import moment from 'moment';
import { Button, Glyphicon } from 'react-bootstrap';

export default class SideNav extends React.Component {
  static propTypes = {
    date:      React.PropTypes.string.isRequired,
    onRefresh: React.PropTypes.func
  };

  render() {
    return (
      <aside className="sidebar">
        <Button bsStyle="primary" className="btn-block">Create Event</Button>
        <Button href={"/"}
                className="btn-block">Home</Button>
        <Button href={this._dateParam(this._nextWeek())}
                className="btn-block">Next Week</Button>
        <Button href={this._dateParam(this._previousWeek())}
                className="btn-block">Previous Week</Button>
        <Button onClick={this.props.onRefresh} className="btn-block">
          <Glyphicon glyph="refresh" />&nbsp;Sync
        </Button>
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
}
