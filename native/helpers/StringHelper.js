import map from 'lodash/map';
import upperFirst from 'lodash/upperFirst';

export const humanize = (email) => {
  const name = email.replace(/@.*$/, '');
  return map(name.split('.'), upperFirst).join(' ');
}
