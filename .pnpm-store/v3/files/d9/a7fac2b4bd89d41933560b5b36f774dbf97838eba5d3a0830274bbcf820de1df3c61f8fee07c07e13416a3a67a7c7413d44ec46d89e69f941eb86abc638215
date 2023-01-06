import React, { cloneElement, PropTypes } from 'react';
import d3 from 'd3';

import { Tooltip } from '../Tooltip';
import { componentType } from '../../utils/proptypes';

const defaultSVGAttributes = {
  strokeWidth: 1,
  stroke: 'black',
  fill: 'none',
};

export function Line({ data, line, interpolate = 'linear', children, format, ...props }) {
  const { x, y } = line;
  const _line = d3.svg.line()
    .x(x)
    .y(y)
    .interpolate(interpolate);

  let tooltips;
  const tooltip = children;
  if (tooltip) {
    tooltips = data.map((d, i) => {
      const tooltipProps = {
        x: x(d),
        y: y(d),
        key: i,
        children: `${format(d, i)}`,
      };
      return cloneElement(tooltip, tooltipProps);
    });
  }

  return (
    <g>
      <path
        d={_line(data)}
        {...defaultSVGAttributes}
        {...props}
      />
      {tooltips}
    </g>
  );
}

Line.propTypes = {
  data: PropTypes.array,
  children: componentType(Tooltip),
  interpolate: PropTypes.string,
  scale: PropTypes.object,
  line: PropTypes.shape({
    x: PropTypes.func,
    y: PropTypes.func,
  }),
  format: PropTypes.func,
};
