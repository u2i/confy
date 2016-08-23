import React from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import Typeahead from 'react-bootstrap-typeahead';
import ContactSource from 'sources/ContactSource';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Token.css';

class EventGuest {
  constructor(object) {
    this.email = object.primary_email;
    this.name = object.name.full_name;
    this.label = `${this.name} <${this.email}>`;
  }
}

export default class GuestsField extends React.Component {
  static propTypes = {
    onChange: React.PropTypes.func.isRequired,
    onError: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { contacts: [] };
    this._fetchContacts();
  }

  render() {
    return (
      <FormGroup>
        <ControlLabel>Guests:</ControlLabel>
        <Typeahead
          multiple
          allowNew
          labelKey="label"
          options={this.state.contacts}
          onChange={this.props.onChange} />
      </FormGroup>
    );
  }

  _fetchContacts() {
    ContactSource
      .fetch()
      .then(contacts => {
        this.setState({ contacts: contacts.data.map(contact => new EventGuest(contact)) });
      })
      .catch((error) => {
        this.props.onError(`Failed to fetch contacts: ${error.data.error}`)
      });
  }
}

