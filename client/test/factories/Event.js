import { Factory } from 'rosie';
import User from './User';
import ConferenceRoom from './ConferenceRoom';

export default new Factory()
  .sequence('id')
  .option('start_time', new Date(2016, 7, 25, 0, 0, 0))
  .option('end_time', new Date(2016, 7, 25, 2, 0, 0))
  .attr('start_timestamp', ['start_time'], (start_time) => start_time.getTime() / 1000)
  .attr('end_timestamp', ['end_time'], (end_time) => end_time.getTime() / 1000)
  .attr('start', ['start_time'], (start_time) => {
    return { date_time: start_time.toISOString() };
  })
  .attr('end', ['end_time'], (end_time) => {
    return { date_time: end_time.toISOString() };
  })
  .attrs({
    creator:         User.build(),
    conference_room: ConferenceRoom.build()
  });
