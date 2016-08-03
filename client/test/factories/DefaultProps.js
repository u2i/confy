import { Factory } from 'rosie';
import ConferenceRoom from './ConferenceRoom';

export default new Factory()
  .attrs({
    conferenceRooms:          [ConferenceRoom.build()],
    days:                     [],
    times:                    [],
    unitEventLengthInSeconds: 60
  });
