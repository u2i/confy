import React from "react";
import { If } from "react-if";
import ConferenceRoomSchema from 'schemas/ConferenceRoomSchema';

const { arrayOf, string } = React.PropTypes;

const RoomSelectGroup = ({ rooms, label }) => (
  <If condition={rooms.length > 0}>
    <optgroup label={label}>
      {rooms.map(room => (
        <option value={room.id} key={room.id}>{room.title}</option>
      ))}
    </optgroup>
  </If>
);

RoomSelectGroup.propTypes = {
  rooms: arrayOf(ConferenceRoomSchema.only('title', 'id')).isRequired,
  label: string.isRequired
};

export default RoomSelectGroup;
