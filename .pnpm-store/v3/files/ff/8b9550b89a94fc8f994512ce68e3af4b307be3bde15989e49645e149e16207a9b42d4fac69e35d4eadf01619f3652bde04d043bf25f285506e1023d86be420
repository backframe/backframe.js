import d3 from 'd3';
import React from 'react';
import ReactDOM from 'react-dom';

import { charts } from 'components';

const { Axis, Chart, Label, Line, Tick } = charts;

const setA = [];
const setB = [];

for (let x = 0; x < 5; x++) {
  setA.push({ value: Math.floor(Math.random() * 10) + 1, time: new Date(x * 10E6) });
  setB.push({ value: Math.floor(Math.random() * 10) + 1, time: new Date(x * 10E6) });
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

const sets = [].concat(setA.map((d) => d.value), d3.max(setB.map((d) => d.value)));

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

const getTickPositions = (scale) => scale.ticks().map(scale);
const getTickDistance = (positions) => Math.abs(positions[1] - positions[0]);

const timeTickPositions = getTickPositions(timeScale);
const timeTickDistance = getTickDistance(timeTickPositions);
const timeTickOffset = timeTickPositions[0];

const colors = [
  '#FEF275',
  '#FF004F',
  '#7B31EA',
];

const timeFormatter = d3.time.format('%I %p');
const formatTime = (d) => timeFormatter(d);

function ChartExample() {
  return (
    <div>
      <h1>Line Chart</h1>
      <Chart
        padding={padding}
        width={width}
        height={height}
      >
        <defs>
          <clipPath id="clip">
            <rect x="0" y="0" width={innerWidth} height={innerHeight} />
          </clipPath>
          <pattern
            id="xPattern"
            x={timeTickOffset}
            y="0"
            width={timeTickDistance * 2}
            height="1" patternUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" height="1" width={timeTickDistance} fill="rgba(255,255,255,0.025)" />
          </pattern>
          <linearGradient id="linear" x1="0" y1="0" x2="0" y2="100%" >
            { colors.map((color, i, a) =>
              (
                <stop
                  key={i}
                  offset={`${(100 / a.length - 1) * i}%`}
                  stopColor={color}
                />
              )
            ) }
          </linearGradient>
          <filter id="glow" y="-100%" height="300%" >
            <feGaussianBlur stdDeviation="15" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow2" x="0" y="-100%" height="300%" >
            <feColorMatrix type="matrix" values=
                        "1  1  1  0  0
                         1  1  1  0  0
                         .8 .8 .8 0  0
                         0  0  0  .4 0"
            />
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="shadow" x="0" y="-100%" height="300%" >
            <feOffset result="offOut" in="SourceAlpha" dx="20" dy="10" />
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>

        <rect
          x="0"
          y="0"
          fill="url(#xPattern)"
          width={innerWidth}
          height={innerHeight}
        />

        <Axis
          className="x-axis"
          scale={timeScale}
          start={{ x: 0, y: innerHeight }}
          end={{ x: innerWidth, y: innerHeight }}
          style={{
            fill: '#CE7494',
            stroke: 'none',
          }}
        >
          <Tick>
            <Label
              translate={{ x: -5, y: 16 }}
              fontSize={12}
              format={formatTime}
              style={{
                stroke: 'rgba(255,255,255,0.025)',
                fill: '#CE7494',
              }}
            />
          </Tick>
        </Axis>
        <Axis
          className="y-axis"
          scale={powerScale}
          start={{ x: 0, y: innerHeight }}
          end={{ x: 0, y: 0 }}
          style={{
            strokeWidth: 0,
            stroke: 'rgba(255,255,255,0.025)',
            fill: '#CE7494',
          }}
        >
          <Tick
            y1={0}
            y2={innerWidth}
            style={{ strokeWidth: 1 }}
          >
            <Label
              translate={{ x: -5, y: 0 }}
              fontSize={12}
              textAnchor="end"
            />
          </Tick>
        </Axis>

        <g clipPath="url(#clip)" filter="url(#glow)" >
          <g filter="url(#shadow)" >
            <g filter="url(#glow2)" >
              <Line
                data={setA}
                line={lineGenerator}
                height={innerHeight}
                width={innerWidth}
                interpolate="basis"
                strokeLinecap="round"
                stroke="url(#linear)"
                strokeWidth="10"
              />
            </g>
          </g>
        </g>
      </Chart>
    </div>
  );
}

ReactDOM.render(
  <ChartExample />,
  document.getElementById('content')
);
