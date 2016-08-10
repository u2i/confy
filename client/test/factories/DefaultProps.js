import moment from 'moment';
import { Factory } from 'rosie';
import ConferenceRoom from './ConferenceRoom';

export default new Factory()
  .attrs({
    conferenceRooms:          [ConferenceRoom.build()],
    days:                     [moment([2016, 7, 25, 0, 0, 0])],
    times:                    [moment([2016, 7, 25, 0, 0, 0]).toISOString()],
    unitEventLengthInSeconds: 60,
    location:                 { query: { date: '2016-08-25' } },
    params:                   {},
    roomKinds:                { narnia: 0 }
  });
