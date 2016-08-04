import { Factory } from 'rosie';

export default new Factory()
  .sequence('id')
  .attrs({
    title:    'Narnia',
    email:    'narnia@resource.calendar.google.com',
    color:    '#dffabd',
    capacity: 10,
    kind: 0
  });
