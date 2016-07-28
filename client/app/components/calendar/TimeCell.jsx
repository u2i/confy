import React from 'react';
import { If } from 'react-if';
import { formatTime } from 'helpers/DateHelper';

const { string, bool, oneOfType, instanceOf } = React.PropTypes;

const TimeCell = (props) => (
  <td className="text-right time-cell">
    <If condition={props.visible}>
      <small>{formatTime(props.time, props.timeFormat)}</small>
    </If>
  </td>
);

TimeCell.propTypes = {
  time:       oneOfType([instanceOf(Date), string]).isRequired,
  visible:    bool,
  timeFormat: string
};

TimeCell.defaultProps = {
  visible: true
};

export default TimeCell;
