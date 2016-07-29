import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

const SideNav = (props) => (
  <aside className="sidebar">
    <Button bsStyle="primary" className="btn-block">Create Event</Button>
    <Button className="btn-block">Home</Button>
    <Button className="btn-block">Next Week</Button>
    <Button className="btn-block">Previous Week</Button>
    <Button onClick={props.onRefresh} className="btn-block">
      <Glyphicon glyph="refresh" />&nbsp;Sync
    </Button>
  </aside>
);

SideNav.propTypes = {
  onRefresh: React.PropTypes.func
};

export default SideNav;
