import React from 'react';
import { Alert } from 'react-bootstrap';
import { If, Then } from 'react-if';

const ErrorField = (props) => (
  <If condition={props.showErrorMessage === true}>
    <Then>
      <Alert bsStyle="danger">
        Error occurred while trying to save event.
      </Alert>
    </Then>
  </If>
);

ErrorField.propTypes = {
  showErrorMessage: React.PropTypes.bool
};

ErrorField.defaultProps = {
  showErrorMessage: false
};

export default ErrorField;