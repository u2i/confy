import React from 'react';
import { instanceOfMoment } from 'proptypes/moment';
import { Row, Col, Jumbotron } from 'react-bootstrap';
import texts from '../texts/texts';
import NoEventControls from 'components/conference_room/layout/controls/NoEventControls';

const NoEvents = ({ onStart, nextEventStart }) => (
  <Row>
    <Col xs={12}>
      <Jumbotron>
        <h3>{texts.NO_MORE_EVENTS}</h3>
        <NoEventControls onStart={onStart} nextEventStart={nextEventStart} />
      </Jumbotron>
    </Col>
  </Row>
);

NoEvents.propTypes = {
  onStart: React.PropTypes.func,
  nextEventStart: instanceOfMoment.isRequired
};

export default NoEvents;
