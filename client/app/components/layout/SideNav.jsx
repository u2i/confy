import React from 'react';
import moment from 'moment';
import { Button, Glyphicon } from 'react-bootstrap';

export default class SideNav extends React.Component {
  static propTypes = {
    date:      React.PropTypes.string,
    onRefresh: React.PropTypes.func
  };

  render() {
    return (
      <aside className="sidebar">
        <Button bsStyle="primary" className="btn-block">Create Event</Button>
        <Button href={"/"}
                bsStyle="primary" className="btn-block">Home</Button>
        <Button href={this._dateParam(this._nextWeek())}
                bsStyle="primary" className="btn-block">Next Week</Button>
        <Button href={this._dateParam(this._previousWeek())}
                bsStyle="primary" className="btn-block">Previous Week</Button>
        <Button onClick={this.props.onRefresh} className="btn-block">
          <Glyphicon glyph="refresh" />&nbsp;Sync
        </Button>
      </aside>
    );
  }

  _startingDate() {
    return this.props.date ? moment(this.props.date) : moment();
  }

  _nextWeek() {
    return this._startingDate().add(1, 'weeks');
  }

  _previousWeek() {
    return this._startingDate().subtract(1, 'weeks');
  }

  _dateParam(date) {
    return `/?date=${date.format('YYYY-MM-DD')}`;
  }
}
