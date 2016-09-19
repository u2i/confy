import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import { Button } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';
import { dateParam, nextWeek, previousWeek } from 'helpers/DateHelper';

import RefreshButton from './RefreshButton';

export default class SideNav extends React.Component {
  static propTypes = {
    date: instanceOfMoment.isRequired,
    onRefresh: React.PropTypes.func,
    updating: React.PropTypes.bool,
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
        <IndexLinkContainer to="/" active={false}>
          <Button className="btn-block">Today</Button>
        </IndexLinkContainer>
        <LinkContainer to={{ pathName: '/', query: { date: dateParam(nextWeek(this.props.date)) } }} active={false}>
          <Button className="btn-block">Next Week</Button>
        </LinkContainer>
        <LinkContainer to={{ pathName: '/', query: { date: dateParam(previousWeek(this.props.date)) } }} active={false}>
          <Button className="btn-block">Previous Week</Button>
        </LinkContainer>
        <RefreshButton onRefresh={this.props.onRefresh} animate={this.props.updating} />
      </aside>
    );
  }

  _handleCreateEvent() {
    this.props.openModal();
  }
}
