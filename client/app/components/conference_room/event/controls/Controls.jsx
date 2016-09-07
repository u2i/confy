import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';

import EventControls from './EventControls';
import NoEventControls from './NoEventControls';

const Controls = ({ event, onConfirm, onStart, onCancel, onFinish }) =>
  event ?
    <EventControls event={event} onConfirm={onConfirm} onCancel={onCancel} onFinish={onFinish} /> :
    <NoEventControls onStart={onStart} />

export default Controls;
