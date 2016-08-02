import React, { PropTypes } from 'react';
import './event.scss';

const DeleteButton = ({ id, onDelete }) => (
  <span onClick={() => onDelete(id)} className="delete-button glyphicon glyphicon-remove">
  </span>
);

DeleteButton.propTypes = {
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default DeleteButton;
