import React from 'react';

export default class TimeInput extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    onChange: React.PropTypes.func,
    value: React.PropTypes.instanceOf(Date)
  };

  componentDidMount() {
    this.input.timepicker({
      timeFormat: 'G:i',
      showDuration: true,
      scrollDefault: this.props.value
    });
  }

  componentWillReceiveProps(nextProps) {
    this.input.timepicker('setTime', nextProps.value);
  }

  render() {
    return <input type="text"
                  className={`time form-control ${this.props.className}`}
                  ref={ref => this.input = $(ref)}
                  onChange={this.props.onChange} />;
  }
}
