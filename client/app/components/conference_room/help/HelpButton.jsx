import React from 'react';
import { Button, Glyphicon } from 'react-bootstrap';

const HelpButton = ({ onClick }) => (
  <Button onClick={onClick}>
    <Glyphicon glyph="question-sign" />
  </Button>
);

HelpButton.propTypes = {
  onClick: React.PropTypes.func
};

export default HelpButton;
