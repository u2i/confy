import React from 'react';
import { Checkbox } from 'react-bootstrap';
import './filters.scss';

export default (props) => (
  <div className="filter-box" style={{ backgroundColor: props.conferenceRoom.color }}>
    <Checkbox value={props.conferenceRoom.id} onChange={props.handler}
              defaultChecked inline>{props.conferenceRoom.title}</Checkbox>
  </div>
);
