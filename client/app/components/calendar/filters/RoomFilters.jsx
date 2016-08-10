import React, { PropTypes } from 'react';
import Filter from './Filter';
import ConferenceRoomSchema from 'schemas/ConferenceRoomSchema';

import './filters.scss';

export default class RoomFilters extends React.Component {
  static propTypes = {
    conferenceRooms: PropTypes.arrayOf(ConferenceRoomSchema.only('id')).isRequired,
    onEnabled:       PropTypes.func.isRequired,
    onDisabled:      PropTypes.func.isRequired,
    filters:         PropTypes.arrayOf(PropTypes.number),
    roomKinds:       PropTypes.object.isRequired
  };

  static defaultProps = {
    filters: []
  };

  constructor(props) {
    super(props);
    this._roomCompare = this._roomCompare.bind(this);
  }

  render() {
    let filters = this.props.conferenceRooms.sort(this._roomCompare).map(conferenceRoom => (
      <Filter enabled={this._filterEnabled(conferenceRoom)}
              onEnabled={() => this.props.onEnabled(conferenceRoom.id)}
              onDisabled={() => this.props.onDisabled(conferenceRoom.id)}
              color={conferenceRoom.color}
              key={conferenceRoom.id}>
        {conferenceRoom.title}
      </Filter>
    ));
    return (
      <div className="filter-container">
        {filters}
      </div>
    );
  }

  _filterEnabled(conferenceRoom) {
    return this.props.filters.find(filter => filter === conferenceRoom.id) != null;
  }

  _roomCompare(leftRoom, rightRoom) {
    if (leftRoom.kind === rightRoom.kind) {
      return leftRoom.title > rightRoom.title;
    }
    return this.props.roomKinds[leftRoom.kind] < this.props.roomKinds[rightRoom.kind];
  }
}
