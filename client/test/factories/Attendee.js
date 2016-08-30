import { Factory } from 'rosie';

export default new Factory()
  .attr('self', false)
  .attr('email', 'example@com')
  .attr('responseStatus', 'accepted');
