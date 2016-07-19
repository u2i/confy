import React from 'react';

export default class HelloWorld extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { name: 'Stranger' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const name = e.target.value;
    this.setState({ name });
  }

  render() {
    return (
      <div className="container">
        <h3>
          Hello, {this.state.name}!
        </h3>
        <hr />
        <form className="form-horizontal">
          <label>
            Say hello to:
          </label>
          <input
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
          />
        </form>
      </div>
    );
  }
}
