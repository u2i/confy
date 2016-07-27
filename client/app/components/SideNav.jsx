import React from 'react'
import { Button, Glyphicon } from 'react-bootstrap';

export default class SideNav extends React.Component {
  static propTypes = {
    onRefresh: React.PropTypes.func
  };

  render() {
    return (
      <aside className="col-xs-12 col-md-2 sidebar">
        <Button bsStyle="primary" className="btn-block">Create Event</Button>
        <Button className="btn-block">Home</Button>
        <Button className="btn-block">Next Week</Button>
        <Button className="btn-block">Previous Week</Button>
        <Button onClick={this.props.onRefresh} className="btn-block">
          <Glyphicon glyph="refresh"/>&nbsp;Sync
        </Button>
      </aside>
    )
  }
}
