import React from 'react';
import { FormGroup, ControlLabel, Radio } from 'react-bootstrap';

const RECURRENCE_OPTIONS = ['none', 'daily', 'weekly', 'every other week', 'monthly'];

export default class RecurrenceComponent extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired
  };

  constructor(...args) {
    super(...args);

    this.state = { checked: 'none' };
    this._isChecked = this._isChecked.bind(this);
    this._onChange = this._onChange.bind(this);
  }

  render() {
    return (
      <FormGroup>
        <ControlLabel>Repeat: &nbsp;</ControlLabel>
        {this._recurrenceOptions()}
      </FormGroup>
    );
  }

  _recurrenceOptions() {
    return RECURRENCE_OPTIONS.map(option => (
      <Radio key={option} value={option} onChange={this._onChange} checked={this._isChecked(option)} inline>
        {option}
      </Radio>
    ));
  }

  _onChange(e) {
    const option = e.target.value;
    this.setState({ checked: option });
    this.props.onChange(option);
  }

  _isChecked(option) {
    return option === this.state.checked;
  }
}
