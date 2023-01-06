import React, { Children, cloneElement, PropTypes } from 'react';

const defaultPadding = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};

export function Chart({ width = 300, height = 150, _padding, children, ...props }) {
  const padding = { ...defaultPadding, ..._padding };
  const innerWidth = width - (padding.left + padding.right);
  const innerHeight = height - (padding.top + padding.bottom);

  const components = Children.map(children, (component) => {
    const childrenProps = { width: innerWidth, heigth: innerHeight };
    return cloneElement(component, childrenProps);
  });

  return (
    <svg
      width={width}
      height={height}
      {...props}
    >
      <g
        transform={`translate(${padding.left} ${padding.top})`}
      >
        {components}
      </g>
    </svg>
  );
}

Chart.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element,
  ]),
  _padding: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    bottom: PropTypes.number,
    left: PropTypes.number,
  }),
  width: PropTypes.number,
  height: PropTypes.number,
};
