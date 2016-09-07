import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

const NoEventControls = ({ onStart }) => (
  <Row>
    <Col xs={4} xsOffset={4}>
      <Button bsStyle="primary" disabled onClick={onStart}>Start</Button>
    </Col>
  </Row>
);

NoEventControls.propTypes = {
  onStart: React.PropTypes.func
};

export default NoEventControls;
