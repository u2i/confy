import { Map } from 'immutable';
import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import Filter from './Filter';
import ConferenceRoomSchema from 'schemas/ConferenceRoomSchema';

import './filters.scss';

export default class RoomFilters extends React.Component {
  static propTypes = {
    conferenceRooms: PropTypes.arrayOf(ConferenceRoomSchema.only('id')).isRequired,
    onFilterToggle: PropTypes.func.isRequired,
    onToggleAll: PropTypes.func,
    filters: PropTypes.instanceOf(Map),
    roomKinds: PropTypes.object.isRequired
  };

  static defaultProps = {
    filters: []
  };

  constructor(...args) {
    super(...args);
    this._roomCompare = this._roomCompare.bind(this);
  }

  render() {
    let filters = this.props.conferenceRooms.sort(this._roomCompare).map(conferenceRoom => (
      <Filter enabled={this._filterEnabled(conferenceRoom)}
              onToggle={() => this.props.onFilterToggle(conferenceRoom.id)}
              color={conferenceRoom.color}
              key={conferenceRoom.id}>
        {conferenceRoom.title}
      </Filter>
    ));
    return (
      <div className="filter-container">
        {filters}
        <Button onClick={this.props.onToggleAll}>Toggle All</Button>
      </div>
    );
  }

  _filterEnabled(conferenceRoom) {
    return this.props.filters.get(conferenceRoom.id, false);
  }

  _roomCompare(leftRoom, rightRoom) {
    if (leftRoom.kind === rightRoom.kind) {
      return leftRoom.title > rightRoom.title;
    }
    return this.props.roomKinds[leftRoom.kind] < this.props.roomKinds[rightRoom.kind];
  }
}
