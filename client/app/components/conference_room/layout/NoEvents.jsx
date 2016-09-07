import React from 'react';
import { Row, Col, Jumbotron } from 'react-bootstrap';
import texts from '../texts';

export default () => (
  <Row>
    <Col xs={12}>
      <Jumbotron>
        <h3>{texts.NO_MORE_EVENTS}</h3>
        <p>Check back tomorrow!</p>
      </Jumbotron>
    </Col>
  </Row>
);
