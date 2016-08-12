import React from 'react';
import { Overlay, Tooltip } from 'react-bootstrap';

const TOOLTIP_MESSAGE = 'You are not the owner of this event';

const DeleteTooltip = ({ target, show }) => (
  <Overlay className="tooltip-overlay destroy-info-overlay"
           target={target}
           show={show}
           placement="right">
    <Tooltip id="tooltip">{TOOLTIP_MESSAGE}</Tooltip>
  </Overlay>
);

DeleteTooltip.propTypes = {
  target: React.PropTypes.func.isRequired,
  show:   React.PropTypes.bool.isRequired
};
export default DeleteTooltip;
