import { Factory } from 'rosie';

export default new Factory()
  .attrs({
    display_name: 'creator',
    email:        'creator@example.com',
    self:         false
  });
