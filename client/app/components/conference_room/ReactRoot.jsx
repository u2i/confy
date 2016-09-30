import React from 'react';
import ConferenceRoomSchema from 'proptypes/schemas/ConferenceRoomSchema';

import ConferenceRoomContainer from './ConferenceRoomContainer';
import EventProvider from './provider/EventProvider';

const ReactRoot = ({ active_conference_room, all_conference_rooms }) => (
  <EventProvider activeConferenceRoom={active_conference_room}
                 allConferenceRooms={all_conference_rooms}
                 component={ConferenceRoomContainer} />
);

ReactRoot.propTypes = {
  active_conference_room: ConferenceRoomSchema.isRequired,
  all_conference_rooms: React.PropTypes.arrayOf(ConferenceRoomSchema).isRequired
};

export default ReactRoot;
