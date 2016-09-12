import React from 'react';
import instanceOfMoment from 'proptypes/moment';
import { If } from 'react-if';
import { formatTime } from 'helpers/DateHelper';

const TimeCell = (props) => (
  <td className="text-right time-cell">
    <If condition={props.visible}>
      <small>{formatTime(props.time, props.timeFormat)}</small>
    </If>
  </td>
);

TimeCell.propTypes = {
  time:       instanceOfMoment.isRequired,
  visible:    React.PropTypes.bool,
  timeFormat: React.PropTypes.string
};

TimeCell.defaultProps = {
  visible: true
};

export default TimeCell;
