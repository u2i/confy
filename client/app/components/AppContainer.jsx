import React from 'react';
import { Grid, Col } from 'react-bootstrap';
import Calendar from './calendar/Calendar';
import SideNav from './layout/SideNav';

const AppContainer = (props) => (
  <Grid>
    <Col xs={12} md={2}>
      <SideNav date={props.date} />
    </Col>
    <Col xs={12} md={10}>
      <Calendar {...props} />
    </Col>
  </Grid>
);

AppContainer.propTypes = {
  date: React.PropTypes.string
};

export default AppContainer;
