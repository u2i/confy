import React, { PropTypes } from 'react';
import Filter from './Filter';
import ConferenceRoomSchema from 'schemas/ConferenceRoomSchema';

import './filters.scss';

export default class RoomFilters extends React.Component {
  static propTypes = {
    conferenceRooms: PropTypes.arrayOf(ConferenceRoomSchema.only('id')).isRequired,
    onEnabled: PropTypes.func.isRequired,
    onDisabled: PropTypes.func.isRequired,
    filters: PropTypes.arrayOf(PropTypes.number)
  };

  static defaultProps = {
    filters: []
  };

  render() {
    let filters = this.props.conferenceRooms.sort((left, right) => left.title > right.title).map(conferenceRoom => (
      <Filter conferenceRoom={conferenceRoom}
              enabled={this._filterEnabled(conferenceRoom)}
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
}
