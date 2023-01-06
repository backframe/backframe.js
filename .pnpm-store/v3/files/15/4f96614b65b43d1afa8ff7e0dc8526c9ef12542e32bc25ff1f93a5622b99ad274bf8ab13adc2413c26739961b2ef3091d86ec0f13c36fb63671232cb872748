import React, { PropTypes } from 'react';

export function Tooltip({ x, y, children, ...props }) {
  return (
    <text
      x={x}
      y={y}
      {...props}
    >
      { children }
    </text>
  );
}

Tooltip.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
    PropTypes.string,
  ]),
  x: PropTypes.number,
  y: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
};
