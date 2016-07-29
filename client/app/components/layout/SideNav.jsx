import React, { PropTypes } from 'react';
import {Button} from 'react-bootstrap';
import moment from 'moment';
import _ from 'lodash';

const { string } = PropTypes;

export default class SideNav extends React.Component {
  static propTypes = {
    date: string
  };

  constructor(...args) {
    super(...args);

    _.bindAll(this,
      '_startingDate', '_nextWeek', '_previousWeek', '_dateParam');
  }

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
    return "/?date=" + date.format('YYYY-MM-DD');
  }
}
