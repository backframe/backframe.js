import d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';

import { charts } from 'components';

const { Chart, Line, Tooltip } = charts;

const setA = [];

for (let x = 0; x < 5; x++) {
  setA.push({ value: Math.floor(Math.random() * 10) + 1, time: new Date(x * 10E6) });
}

const [width, height] = [600, 300];
const padding = {
  top: 16,
  right: 16,
  bottom: 16,
  left: 16 + 15,
};

const innerWidth = width - (padding.left + padding.right);
const innerHeight = height - (padding.top + padding.bottom);

const sets = [].concat(setA.map((d) => d.value));

const powerScale = d3.scale.linear()
  .domain([0].concat(d3.max(sets) + 1))
  .range([0, innerHeight]);

const timeScale = d3.time.scale()
  .domain(d3.extent(setA.map((d) => d.time)))
  .range([0, innerWidth]); // Clip the ends off the graph

const lineGenerator = {
  x: (d) => timeScale(d.time),
  y: (d) => innerHeight - powerScale(d.value),
};

const displayText = (d) => d.value;

function TooltipExample() {
  return (
    <div>
      <h1>Line Chart with Tooltips</h1>
      <Chart
        padding={padding}
        width={width}
        height={height}
      >
        <Line
          data={setA}
          line={lineGenerator}
          format={displayText}
        >
          <Tooltip
            textAnchor="middle"
            transform="translate(0 5)"
            style={{
              fill: 'white',
            }}
          />
        </Line>
      </Chart>
    </div>
  );
}

ReactDOM.render(
  <TooltipExample />,
  document.getElementById('content')
);
