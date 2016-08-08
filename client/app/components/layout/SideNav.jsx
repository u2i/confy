import moment from 'moment';
import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { DATE_PARAM_FORMAT } from 'helpers/DateHelper';

import RefreshButton from './RefreshButton';

export default class SideNav extends React.Component {
  static propTypes = {
    date:      PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
    onRefresh: PropTypes.func,
    updating:  PropTypes.bool
  };

  render() {
    return (
      <aside className="sidebar">
        <Button bsStyle="primary" className="btn-block">Create Event</Button>
        <IndexLinkContainer to="/" active={false}>
          <Button className="btn-block">Home</Button>
        </IndexLinkContainer>
        <LinkContainer to={{ pathName: '/', query: { date: this._nextWeek() } }} active={false}>
          <Button className="btn-block">Next Week</Button>
        </LinkContainer>
        <LinkContainer to={{ pathName: '/', query: { date: this._previousWeek() } }} active={false}>
          <Button className="btn-block">Previous Week</Button>
        </LinkContainer>
        <RefreshButton onRefresh={this.props.onRefresh} animate={this.props.updating} />
      </aside>
    );
  }

  _nextWeek() {
    return moment(this.props.date).add(1, 'weeks').format(DATE_PARAM_FORMAT);
  }

  _previousWeek() {
    return moment(this.props.date).subtract(1, 'weeks').format(DATE_PARAM_FORMAT);
  }
}
