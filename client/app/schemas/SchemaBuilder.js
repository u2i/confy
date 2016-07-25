import { PropTypes } from 'react'

export default (schema) => {
  const defaults = {
    only:   Object.getOwnPropertyNames(schema),
    except: []
  };

  return (options = {}) => {
    let {only, except} = Object.assign({}, defaults, options);

    let shape = {};

    for (let prop in schema) {
      if (schema.hasOwnProperty(prop) && only.includes(prop) && !except.includes(prop)) {
        shape[prop] = schema[prop];
      }
    }

    return PropTypes.shape(shape);
  }
}