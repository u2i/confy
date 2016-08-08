import { Factory } from 'rosie';
import { sortEventsByStartTime } from 'helpers/EventHelper';
import Event from './Event';

export default new Factory()
  .option('length', 1)
  .attr('events', ['length'], length => [...new Array(length).keys()].map(() => Event.build()))
  .attr('start', ['events'], events => sortEventsByStartTime(events)[0].start_timestamp)
  .attr('end', ['events'], events => sortEventsByStartTime[events.length - 1].end_timestamp);
