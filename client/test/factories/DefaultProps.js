import { Factory } from 'rosie';

export default new Factory()
  .attrs({
    conferenceRooms:          [],
    days:                     [],
    times:                    [],
    unitEventLengthInSeconds: 60
  });
