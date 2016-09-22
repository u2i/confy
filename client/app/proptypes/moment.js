import moment from 'moment';
import createChainableTypeChecker from './chainableTypeChecker';

export const instanceOfMoment = createChainableTypeChecker(
  (props, propName, componentName) => {
    if (!moment.isMoment(props[propName])) {
      return new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`.
      Expected prop of type \`Moment\` and found \`${typeof props[propName]}\`.`
      );
    }
    return null;
  });

export const instanceOfDuration = createChainableTypeChecker(
  (props, propName, componentName) => {
    if (!moment.isDuration(props[propName])) {
      return new Error(
        `Invalid prop \`${propName}\` supplied to \`${componentName}\`.
      Expected prop of type \`Moment.Duration\` and found \`${typeof props[propName]}\`.`
      );
    }
    return null;
  });
