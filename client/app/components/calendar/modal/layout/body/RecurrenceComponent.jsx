import React from 'react';
import { FormGroup, ControlLabel, FormControl, Radio } from 'react-bootstrap';

const RECURRENCE_OPTIONS = ['none', 'daily', 'weekly', 'every other week', 'monthly'];

export default class RecurrenceComponent extends React.Component {
  constructor(...args) {
    super(...args);

    this.state = { checked: 'none' };
    this._isChecked = this._isChecked.bind(this);
  };

  _onChange(option, e) {
    e.stopPropagation();
    this.setState({ checked: option});
    this.props.onChange(option);
  };

  _isChecked(option) {
    return option === this.state.checked;
  };

  _recurrenceOptions() {
    return RECURRENCE_OPTIONS.map(option => (
      <Radio key={option} onChange={this._onChange.bind(this, option)} checked={this._isChecked(option)} inline>
        {option}
      </Radio>
    ));
  }

  render() {
    return (
      <FormGroup>
        <ControlLabel>Repeat: &nbsp;</ControlLabel>
        {this._recurrenceOptions()}
      </FormGroup>
    );
  }
}
