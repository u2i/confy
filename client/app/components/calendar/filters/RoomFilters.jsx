import React from 'react';
import FilterBox from './FilterBox';
import { Checkbox } from 'react-bootstrap';
import './filters.scss';

export default class RoomFilters extends React.Component {

  constructor() {
    super();
    this._handleCheckbox = this._handleCheckbox.bind(this);
  }

  _handleCheckbox(event, conferenceRoomId) {
    if (!event.target.checked) {
      this.props.add(conferenceRoomId);
    }
    else {
      this.props.delete(conferenceRoomId);
    }
  }

  render() {
    let filters = this.props.conferenceRooms.map(
      (conferenceRoom) => {
        return (
          <FilterBox conferenceRoom={conferenceRoom}
                     handler={(e) => this._handleCheckbox(e, conferenceRoom.id)} />
        );
      }
    );
    return (
      <div className="filter-container">
        {filters}
      </div>
    );
  }
}
