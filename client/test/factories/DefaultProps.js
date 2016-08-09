import { Factory } from 'rosie';
import ConferenceRoom from './ConferenceRoom';

export default new Factory()
  .attrs({
    conferenceRooms:          [ConferenceRoom.build()],
    days:                     [new Date(2016, 7, 25, 0, 0, 0).toISOString()],
    times:                    [new Date(2016, 7, 25, 0, 0, 0).toISOString()],
    unitEventLengthInSeconds: 60,
    location:                 { query: { date: '2016-08-25' } },
    params:                   {}
  });
