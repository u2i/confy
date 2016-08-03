import { Factory } from 'rosie';

export default new Factory()
  .sequence('id', i => `id${i}`)
  .attr('type', 'danger')
