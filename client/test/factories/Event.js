import { Factory } from 'rosie';
import User from './User';
import ConferenceRoom from './ConferenceRoom';

export default new Factory()
  .sequence('id')
  .option('start_time', new Date(2016, 7, 25, 0, 0, 0))
  .option('end_time', new Date(2016, 7, 25, 2, 0, 0))
  .attr('start_timestamp', ['start_time'], startTime => startTime.getTime() / 1000)
  .attr('end_timestamp', ['end_time'], endTime => endTime.getTime() / 1000)
  .attr('start', ['start_time'], startTime => ({ date_time: startTime.toISOString() }))
  .attr('end', ['end_time'], endTime => ({ date_time: endTime.toISOString() }))
  .attrs({
    creator:         User.build(),
    conference_room: ConferenceRoom.build()
  });
