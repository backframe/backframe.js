'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.Tick = Tick;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _proptypes = require('../../utils/proptypes');

var _Label = require('../Label');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var tickSize = 3;
var fontSize = 16;

function Tick(_ref) {
  var data = _ref.data;
  var label = _ref.label;
  var transform = _ref.transform;
  var value = _ref.value;

  var props = _objectWithoutProperties(_ref, ['data', 'label', 'transform', 'value']);

  var defaultProps = {
    x: value,
    y: 0,
    children: data,
    fontSize: fontSize,
    textAnchor: 'middle',
    transform: transform
  };

  var labelComponent = null;

  if (label) {
    labelComponent = props.children || _react2['default'].createElement(_Label.Label, null);
    labelComponent = (0, _react.cloneElement)(labelComponent, _extends({}, defaultProps, labelComponent.props));
  }

  return _react2['default'].createElement(
    'g',
    null,
    _react2['default'].createElement('line', _extends({
      x1: value,
      x2: value,
      y1: -tickSize,
      y2: tickSize
    }, props)),
    labelComponent
  );
}

Tick.propTypes = {
  children: (0, _proptypes.componentType)(_Label.Label),
  data: _react.PropTypes.any,
  label: _react.PropTypes.bool,
  transform: _react.PropTypes.string,
  value: _react.PropTypes.number
};