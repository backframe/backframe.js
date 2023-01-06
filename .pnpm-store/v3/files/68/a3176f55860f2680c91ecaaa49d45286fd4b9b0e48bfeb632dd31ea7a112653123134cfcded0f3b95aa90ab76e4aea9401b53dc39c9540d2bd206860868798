import React, { cloneElement, PropTypes } from 'react';

import { componentType } from '../../utils/proptypes';

import { Label } from '../Label';

const tickSize = 3;
const fontSize = 16;

export function Tick({ data, label, transform, value, ...props }) {
  const defaultProps = {
    x: value,
    y: 0,
    children: data,
    fontSize,
    textAnchor: 'middle',
    transform,
  };

  let labelComponent = null;

  if (label) {
    labelComponent = props.children || <Label />;
    labelComponent = cloneElement(labelComponent, {
      ...defaultProps,
      ...labelComponent.props,
    });
  }

  return (
    <g>
      <line
        x1={value}
        x2={value}
        y1={-tickSize}
        y2={tickSize}
        {...props}
      />
      {labelComponent}
    </g>
  );
}

Tick.propTypes = {
  children: componentType(Label),
  data: PropTypes.any,
  label: PropTypes.bool,
  transform: PropTypes.string,
  value: PropTypes.number,
};
