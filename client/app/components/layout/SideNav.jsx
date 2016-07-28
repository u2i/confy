import React from 'react';
import { Button } from 'react-bootstrap';

export default () => (
  <aside className="col-xs-12 col-md-2 sidebar">
    <Button bsStyle="primary" className="btn-block">Create Event</Button>
    <Button bsStyle="primary" className="btn-block">Home</Button>
    <Button bsStyle="primary" className="btn-block">Next Week</Button>
    <Button bsStyle="primary" className="btn-block">Previous Week</Button>
  </aside>
);
