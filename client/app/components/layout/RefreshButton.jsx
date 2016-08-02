import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

import './refresh_button.scss';

const RefreshButton = ({ onRefresh, animate }) => (
  <Button onClick={onRefresh} className="btn-block">
    <Glyphicon glyph="refresh" className={animate ? 'spin' : null} />
    &nbsp;Sync
  </Button>
);

RefreshButton.propTypes = {
  onRefresh: React.PropTypes.func,
  animate:   React.PropTypes.bool
};

export default RefreshButton;
