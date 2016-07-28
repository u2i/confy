import React, { PropTypes } from 'react';
import { Checkbox } from 'react-bootstrap';
import Filter from './Filter';
import ConferenceRoomSchema from 'schemas/ConferenceRoomSchema'

import './filters.scss';

export default class RoomFilters extends React.Component {
  static propTypes = {
    conferenceRooms: PropTypes.arrayOf(ConferenceRoomSchema.only('id')).isRequired,
    onEnabled:       PropTypes.func.isRequired,
    onDisabled:      PropTypes.func.isRequired,
    filters:         PropTypes.arrayOf(PropTypes.number)
  };

  static defaultProps = {
    filters: []
  };

  render() {
    let filters = this.props.conferenceRooms.map(conferenceRoom => (
        <Filter conferenceRoom={conferenceRoom}
                enabled={this._filterEnabled(conferenceRoom)}
                onEnabled={this.props.onEnabled}
                onDisabled={this.props.onDisabled}
                key={conferenceRoom.id} />
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
