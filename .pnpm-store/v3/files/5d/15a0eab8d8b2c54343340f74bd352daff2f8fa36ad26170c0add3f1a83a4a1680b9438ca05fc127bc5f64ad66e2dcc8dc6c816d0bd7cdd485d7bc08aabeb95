'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.Axis = Axis;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _proptypes = require('../../utils/proptypes');

var _Tick = require('../Tick');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var defaultStyle = {
  strokeWidth: 1,
  stroke: 'black'
};

var origin = { x: 0, y: 0 };
var defaultEndpoint = { x: 300, y: 150 };

function Axis(_ref) {
  var children = _ref.children;
  var _ref$count = _ref.count;
  var count = _ref$count === undefined ? 10 : _ref$count;
  var scale = _ref.scale;
  var _ref$start = _ref.start;
  var start = _ref$start === undefined ? origin : _ref$start;
  var _ref$end = _ref.end;
  var end = _ref$end === undefined ? defaultEndpoint : _ref$end;
  var _ref$label = _ref.label;
  var label = _ref$label === undefined ? true : _ref$label;
  var style = _ref.style;

  var props = _objectWithoutProperties(_ref, ['children', 'count', 'scale', 'start', 'end', 'label', 'style']);

  var deltaX = end.x - start.x;
  var deltaY = end.y - start.y;
  var length = Math.pow(Math.pow(deltaX, 2) + Math.pow(deltaY, 2), 0.5);
  var rotate = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

  var tickComponent = children || _react2['default'].createElement(_Tick.Tick, null);

  var tickProps = _extends({
    label: label,
    rotate: rotate
  }, tickComponent.props);

  var ticks = scale.ticks(count).map(function (d) {
    return { data: d, value: scale(d) };
  }).map(function (_ref2, i) {
    var data = _ref2.data;
    var value = _ref2.value;

    var singleTickProps = {
      key: i,
      data: data,
      value: value,
      transform: 'rotate(' + -rotate + ' ' + String(value) + ' 0)'
    };
    return (0, _react.cloneElement)(tickComponent, _extends({}, tickProps, singleTickProps));
  });

  return _react2['default'].createElement(
    'g',
    _extends({
      style: _extends({}, defaultStyle, style),
      transform: 'translate(' + String(start.x) + ' ' + String(start.y) + ') rotate(' + rotate + ')'
    }, props),
    _react2['default'].createElement('line', {
      x1: 0,
      x2: length,
      y1: 0,
      y2: 0
    }),
    ticks
  );
}

Axis.propTypes = {
  count: _react.PropTypes.number,
  children: (0, _proptypes.componentType)(_Tick.Tick),
  label: _react.PropTypes.bool,
  scale: _react.PropTypes.func,
  start: _react.PropTypes.object,
  style: _react.PropTypes.object,
  end: _react.PropTypes.object
};