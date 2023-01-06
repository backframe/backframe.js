'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.Line = Line;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _d = require('d3');

var _d2 = _interopRequireDefault(_d);

var _Tooltip = require('../Tooltip');

var _proptypes = require('../../utils/proptypes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var defaultSVGAttributes = {
  strokeWidth: 1,
  stroke: 'black',
  fill: 'none'
};

function Line(_ref) {
  var data = _ref.data;
  var line = _ref.line;
  var _ref$interpolate = _ref.interpolate;
  var interpolate = _ref$interpolate === undefined ? 'linear' : _ref$interpolate;
  var children = _ref.children;
  var format = _ref.format;

  var props = _objectWithoutProperties(_ref, ['data', 'line', 'interpolate', 'children', 'format']);

  var x = line.x;
  var y = line.y;

  var _line = _d2['default'].svg.line().x(x).y(y).interpolate(interpolate);

  var tooltips = void 0;
  var tooltip = children;
  if (tooltip) {
    tooltips = data.map(function (d, i) {
      var tooltipProps = {
        x: x(d),
        y: y(d),
        key: i,
        children: '' + String(format(d, i))
      };
      return (0, _react.cloneElement)(tooltip, tooltipProps);
    });
  }

  return _react2['default'].createElement(
    'g',
    null,
    _react2['default'].createElement('path', _extends({
      d: _line(data)
    }, defaultSVGAttributes, props)),
    tooltips
  );
}

Line.propTypes = {
  data: _react.PropTypes.array,
  children: (0, _proptypes.componentType)(_Tooltip.Tooltip),
  interpolate: _react.PropTypes.string,
  scale: _react.PropTypes.object,
  line: _react.PropTypes.shape({
    x: _react.PropTypes.func,
    y: _react.PropTypes.func
  }),
  format: _react.PropTypes.func
};