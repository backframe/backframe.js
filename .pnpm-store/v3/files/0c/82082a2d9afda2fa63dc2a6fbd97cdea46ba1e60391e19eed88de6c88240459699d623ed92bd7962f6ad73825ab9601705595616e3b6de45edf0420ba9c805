import React, { cloneElement, PropTypes } from 'react';

import { componentType } from '../../utils/proptypes';

import { Tick } from '../Tick';

const defaultStyle = {
  strokeWidth: 1,
  stroke: 'black',
};

const origin = { x: 0, y: 0 };
const defaultEndpoint = { x: 300, y: 150 };

export function Axis({
  children,
  count = 10,
  scale,
  start = origin,
  end = defaultEndpoint,
  label = true,
  style,
  ...props,
}) {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const length = Math.pow(Math.pow(deltaX, 2) + Math.pow(deltaY, 2), 0.5);
  const rotate = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

  const tickComponent = children || <Tick />;

  const tickProps = {
    label,
    rotate,
    ...tickComponent.props,
  };

  const ticks = scale.ticks(count)
    .map((d) => ({ data: d, value: scale(d) }))
    .map(({ data, value }, i) => {
      const singleTickProps = {
        key: i,
        data,
        value,
        transform: `rotate(${-rotate} ${value} 0)`,
      };
      return cloneElement(tickComponent, { ...tickProps, ...singleTickProps });
    });

  return (
    <g
      style={{ ...defaultStyle, ...style }}
      transform={`translate(${start.x} ${start.y}) rotate(${rotate})`}
      {...props}
    >
      <line
        x1={0}
        x2={length}
        y1={0}
        y2={0}
      />
      {ticks}
    </g>
  );
}

Axis.propTypes = {
  count: PropTypes.number,
  children: componentType(Tick),
  label: PropTypes.bool,
  scale: PropTypes.func,
  start: PropTypes.object,
  style: PropTypes.object,
  end: PropTypes.object,
};
