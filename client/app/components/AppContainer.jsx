import React from 'react';
import { Grid, Col } from 'react-bootstrap';
import Calendar from './calendar/Calendar';
import SideNav from './layout/SideNav';

export default (props) => (
  <Grid>
    <Col xs={12} md={2}>
      <SideNav />
    </Col>
    <Col xs={12} md={10}>
      <Calendar {...props} />
    </Col>
  </Grid>
);
