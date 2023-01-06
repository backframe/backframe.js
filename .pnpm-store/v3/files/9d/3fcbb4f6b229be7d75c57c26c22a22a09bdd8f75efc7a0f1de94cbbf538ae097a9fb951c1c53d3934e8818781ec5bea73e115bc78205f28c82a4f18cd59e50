import React, { PropTypes } from 'react';

const fontSize = 16;

const identity = v => v;

const origin = { x: 0, y: 0 };

export function Label({
  x,
  y,
  transform,
  format = identity,
  translate = origin,
  children,
  ...props,
}) {
  const labelText = children ? format(children) : children;
  return (
    <g
      transform={transform}
    >
      <text
        x={x}
        y={y}
        fontSize={fontSize}
        transform={`translate(${translate.x} ${translate.y})`}
        {...props}
      >
        {labelText}
      </text>
    </g>
  );
}

Label.propTypes = {
  children: PropTypes.any,
  format: PropTypes.func,
  transform: PropTypes.string,
  translate: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  x: PropTypes.number,
  y: PropTypes.number,
};
