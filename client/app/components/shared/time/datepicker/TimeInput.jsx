import assign from 'lodash/assign';
import React from 'react';

const { string, func, instanceOf, bool } = React.PropTypes;

const PICKER_OPTIONS = {
  timeFormat: 'G:i'
};

export default class TimeInput extends React.Component {
  static propTypes = {
    className: string,
    onChange: func,
    value: instanceOf(Date),
    minTime: instanceOf(Date),
    showDuration: bool
  };

  componentDidMount() {
    this._initPicker();
    this._bindChangeListener();
    this._updatePicker(this.props.value);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value.getTime() !== this.props.value.getTime()) {
      this._updatePicker(nextProps.value);
    }
  }

  render() {
    return (
      <input type="text"
             className={`time form-control ${this.props.className}`}
             ref={ref => this.input = $(ref)} />
    );
  }

  _initPicker() {
    this.input.timepicker(assign({}, PICKER_OPTIONS, {
      showDuration: this.props.showDuration,
      scrollDefault: this.props.value,
      minTime: this.props.minTime
    }));
  }

  _bindChangeListener() {
    this.input.on('changeTime', () => {
      if (this.props.onChange) this.props.onChange(this.input.timepicker('getTime'));
    });
    this.input.on('timeFormatError', () => {
      this.props.onChange();
    });
  }

  _updatePicker(value) {
    this.input.timepicker('setTime', value);
  }
}
