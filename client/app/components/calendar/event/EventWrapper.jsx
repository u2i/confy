/* eslint react/prefer-stateless-function: 0 */

import React from 'react';
import dimension from 'react-dimensions';
import { If, Then } from 'react-if';

import EventGroup from './EventGroup';

class EventWrapper extends React.Component {
  static propTypes = {
    events: React.PropTypes.array
  };

  render() {
    return (
      <If condition={this.props.events != null}>
        <Then>{() =>
          <EventGroup {...this.props} />}
        </Then>
      </If>
    );
  }
}

export default dimension()(EventWrapper);
