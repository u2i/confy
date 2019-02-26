import React from 'react';
import { Button } from 'react-native-elements';

const ZOOM_REGEX = new RegExp('https:\/\/zoom.us\/j\/[0-9]+');

export default class EventAttendees extends React.Component {
  state = {
    opening: false
  }

  onPress = (event, callLink, onCallStart) => {
    if (!this.state.opening) {
      this.setState({ opening: true }, () => {
        setTimeout(() => { this.setState({ opening: false }) }, 5000)
        onCallStart(event.id, callLink)
      })
    }
  }

  findZoomLink = (event) => {
    let match = null

    if (event.description) {
      match = event.description.match(ZOOM_REGEX)
    } else if (event.extended_properties) {
      match = event.extended_properties.shared.invitation0.match(ZOOM_REGEX)
    }

    return match ? match[0] : null
  }

  hasZoomCall = (event) => {
    return event.description && event.description.match(ZOOM_REGEX) ||
      event.extended_properties && event.extended_properties.shared.invitation0.match(ZOOM_REGEX)
  }

  render() {
    const { event, onCallStart } = this.props;
    const startCallLabel = this.hasZoomCall(event) ? 'Open Zoom' : 'Open Hangouts'
    const callLink = this.findZoomLink(event) || event.hangout_link

    if (callLink) {
      return (
        <Button loading={this.state.opening}
                loadingRight={true}
                rounded={true}
                textStyle={{fontSize: 18}}
                onPress={() => { this.onPress(event, callLink, onCallStart) } }
                icon={this.state.opening ? {} : {name: 'call'}}
                backgroundColor='purple'
                containerViewStyle={{marginRight: 0}}
                title={this.state.opening ? 'Opening': startCallLabel}
        />
      )
    }
  }
}
