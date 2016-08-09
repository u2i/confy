import { Factory } from 'rosie';

export default new Factory()
  .attrs({
    conferenceRooms:          [],
    days:                     [new Date(2016, 7, 25, 0, 0, 0).toISOString()],
    times:                    [new Date(2016, 7, 25, 0, 0, 0).toISOString()],
    unitEventLengthInSeconds: 60
  });
