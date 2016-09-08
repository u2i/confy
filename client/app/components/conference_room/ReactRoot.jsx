import React from 'react';
import ConferenceRoomSchema from 'proptypes/schemas/ConferenceRoomSchema';

import ConferenceRoomContainer from './ConferenceRoomContainer';
import EventProvider from './provider/EventProvider';

const ReactRoot = ({ conference_room }) => (
  <EventProvider conferenceRoom={conference_room} component={ConferenceRoomContainer} />
);

ReactRoot.propTypes = {
  conference_room: ConferenceRoomSchema.isRequired
};

export default ReactRoot;
