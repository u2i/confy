import moment from 'moment';
import createChainableTypeChecker from './chainableTypeChecker';

const instanceOfMoment = (props, propName, componentName) => {
  if (!moment.isMoment(props[propName])) {
    return new Error(
      `Invalid prop \`${propName}\` supplied to \`${componentName}\`.
      Expected prop of type \`Moment\` and found \`${typeof props[propName]}\`.`
    );
  }
};

export default createChainableTypeChecker(instanceOfMoment);
