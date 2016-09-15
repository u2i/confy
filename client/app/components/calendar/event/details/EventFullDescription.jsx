import React from 'react';
import { If } from 'react-if';

const EventFullDescription = ({ description }) => (
  <div className="event-description">
    <div>
      <small>Description:&nbsp;</small>
      <p>{description}</p>
    </div>
  </div>
);

EventFullDescription.propTypes = {
  description: React.PropTypes.string.isRequired
};

export default EventFullDescription;
