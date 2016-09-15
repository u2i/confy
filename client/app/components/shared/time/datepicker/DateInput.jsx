import assign from 'lodash/assign';
import React from 'react';
import moment from 'moment';

const { string, func, instanceOf } = React.PropTypes;

const FORMAT = 'dd-mm-yyyy';
const PICKER_OPTIONS = {
  format: FORMAT,
  autoclose: true,
  todayHighlight: true,
  weekStart: 1
};

export default class DateInput extends React.Component {
  static propTypes = {
    value: instanceOf(Date),
    minDate: instanceOf(Date),
    onChange: func,
    className: string
  };

  componentDidMount() {
    this._initPicker();
    this._updatePicker(this.props.value);
    this._bindChangeListener();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value.getTime() !== this.props.value.getTime()) {
      this._updatePicker(nextProps.value);
    }
  }

  render() {
    return (<input type="text"
                  className={`date form-control ${this.props.className}`}
                  ref={ref => this.input = $(ref)} />);
  }

  _initPicker() {
    this.input.datepicker(assign({}, PICKER_OPTIONS, {
      startDate: this.props.minDate
    }));
  }

  _bindChangeListener() {
    this.input.datepicker().on('changeDate', () => {
      if (this._isValid() && this.props.onChange) {
        this.props.onChange(this.input.datepicker('getDate'));
      }
      else if (this.props.onError) {
        this.props.onChange();
      }
    });
  }

  _isValid() {
    return moment(this.input.datepicker('getDate'), FORMAT).isValid();
  }

  _updatePicker(value) {
    this.input.datepicker('setDate', value);
    this.input.datepicker('update');
  }
}
