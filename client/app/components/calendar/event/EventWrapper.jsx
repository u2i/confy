import React from 'react';
import moment from 'moment';
import { If, Then } from 'react-if';
import { isToday } from 'helpers/DateHelper';
import classNames from 'classnames';
import bindAll from 'lodash/bindAll';

import '../table/calendar.scss';

import EventGroup from './EventGroup';

const FREE_SPACE_FACTOR = 0.05;
const EVENT_GROUP_SPACE = 1 - FREE_SPACE_FACTOR;

class EventWrapper extends React.Component {
  static propTypes = {
    events:    React.PropTypes.array,
    onDelete:  React.PropTypes.func.isRequired,
    timestamp: React.PropTypes.number.isRequired,
    onCellClick: React.PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);
    this.state = { height: 0, width: 0 };

    bindAll(this, ['handleContainerMounted', 'handleResize', '_handleCellClick']);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  handleContainerMounted(container) {
    this.container = container;
    this.handleResize();
  }

  handleResize() {
    if (this.container) {
      const { width, height } = this.container.getBoundingClientRect();
      this.setState({ width: width + 1, height: height + 1 });
    }
  }

  render() {
    const tdClassNames = classNames({ 'today-column': isToday(this.props.timestamp * 1000) });
    return (
      <td ref={this.handleContainerMounted} className={tdClassNames} onClick={this._handleCellClick}>
        <If condition={this.props.events != null && this.props.events.length > 0}>
          <Then>{() =>
            <EventGroup {...this.props}
                        containerWidth={EVENT_GROUP_SPACE * this.state.width}
                        containerHeight={this.state.height}
                        onDelete={this.props.onDelete} />}
          </Then>
        </If>
      </td>
    );
  }

  _handleCellClick() {
    const startTime = moment(this.props.timestamp * 1000);
    const endTime = startTime.clone().add(30, 'minutes');
    this.props.onCellClick(startTime, endTime);
  }
}

export default EventWrapper;
