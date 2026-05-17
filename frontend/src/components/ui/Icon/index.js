import React from 'react';

const Icon = ({ component: Component, size = 24, className = '' }) => (
  <span className={className} style={{ display: 'inline-flex', width: size, height: size }}>
    <Component />
  </span>
);
export default Icon;
