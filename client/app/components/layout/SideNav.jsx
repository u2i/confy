import React from 'react';
import { Button } from 'react-bootstrap';

import RefreshButton from './RefreshButton';

const SideNav = ({ onRefresh, updating }) => (
  <aside className="sidebar">
    <Button bsStyle="primary" className="btn-block">Create Event</Button>
    <Button className="btn-block">Home</Button>
    <Button className="btn-block">Next Week</Button>
    <Button className="btn-block">Previous Week</Button>
    <RefreshButton onRefresh={onRefresh} animate={updating} />
  </aside>
);

SideNav.propTypes = {
  onRefresh: React.PropTypes.func,
  updating: React.PropTypes.bool
};

export default SideNav;
