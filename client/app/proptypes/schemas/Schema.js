import pick from 'lodash/pick';
import omit from 'lodash/omit';
import { PropTypes } from 'react';

export default function wrap(schema) {
  const shape = PropTypes.shape(schema);

  shape.only = (...props) => wrap(pick(schema, props));
  shape.except = (...props) => wrap(omit(schema, props));

  return shape;
}
