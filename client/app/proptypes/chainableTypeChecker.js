
export default function createChainableTypeChecker(validation) {
  function checkType(isRequired, props, propName, componentName) {
    if (props[propName] == null) {
      if (isRequired) {
        return new Error(`Required prop \`${propName}\` was not specified in \`${componentName}\`.`);
      }
      return null;
    } else {
      return validation(props, propName, componentName);
    }
  }

  let chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}
