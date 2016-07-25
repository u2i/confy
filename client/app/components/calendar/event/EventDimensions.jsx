import React from 'react'
import Dimension from 'react-dimensions'
import { If, Then } from 'react-if'

import EventContainer from './EventContainer'

class EventDimensions extends React.Component {
  static propTypes = {
    events:          React.PropTypes.array,
  };

  render() {
    return (
      <If condition={this.props.events != null}>
        <Then>{() =>
          <EventContainer {...this.props}
                          containerWidth={this.props.containerWidth}
                          containerHeight={this.props.containerHeight} />}
        </Then>
      </If>
    );
  }
}

export default Dimension()(EventDimensions);
