import { Factory } from 'rosie';

export default new Factory()
  .attr('self', false)
  .attr('email', 'mail@example.com')
  .attr('response_status', 'accepted');
