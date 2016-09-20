import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import { Row, Col, Jumbotron } from 'react-bootstrap';
import texts from '../texts/texts';
import NoEventControls from 'components/conference_room/layout/controls/NoEventControls';

const NoEvents = ({ onCreate }) => (
  <Row>
    <Col xs={12}>
      <Jumbotron>
        <h3>{texts.NO_MORE_EVENTS}</h3>
        <NoEventControls onCreate={onCreate} />
      </Jumbotron>
    </Col>
  </Row>
);

NoEvents.propTypes = {
  onCreate: React.PropTypes.func
};

export default NoEvents;
