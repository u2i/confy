import React from "react";
import {Alert, Button} from "react-bootstrap";
import {If, Then} from "react-if";

const ErrorField = (props) => (
  <If condition={props.show === true}>
    <Then>
      <Alert bsStyle="danger">
        Error occurred while trying to save event.
      </Alert>
    </Then>
  </If>
);

ErrorField.propTypes = {
  show: React.PropTypes.bool
};

ErrorField.defaultProps = {
  show: false
};

export default ErrorField;
