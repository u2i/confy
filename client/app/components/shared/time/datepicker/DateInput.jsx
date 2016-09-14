import React from 'react';

export default class DateInput extends React.Component {
  componentDidMount() {
    $(this.input).datepicker({
      format: 'dd-mm-yyyy',
      autoclose: true
    });
  }

  render() {
    return <input type="text"
                  className={`date form-control ${this.props.className}`}
                  ref={ref => this.input = ref} />;
  }
}
