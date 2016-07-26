import _ from 'lodash'
import { PropTypes } from 'react'

export default function wrap(schema) {
  let shape = PropTypes.shape(schema);

  shape.only = (...props) => wrap(_.pick(schema, props));
  shape.except = (...props) => wrap(_.omit(schema, props));

  return shape;
}
