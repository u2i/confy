import React from 'react';
import { Checkbox } from 'react-bootstrap';

import './filters.scss';

const Filter = ({ onToggle, color, enabled, children }) => (
  <div className="filter-box" style={{ backgroundColor: color }}>
    <Checkbox onChange={onToggle}
              checked={enabled}
              inline>
      {children}
    </Checkbox>
  </div>
);

Filter.propTypes = {
  onToggle: React.PropTypes.func,
  color: React.PropTypes.string,
  enabled: React.PropTypes.bool,
  children: React.PropTypes.node
};

export default Filter;
