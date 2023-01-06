'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.Label = Label;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var fontSize = 16;

var identity = function identity(v) {
  return v;
};

var origin = { x: 0, y: 0 };

function Label(_ref) {
  var x = _ref.x;
  var y = _ref.y;
  var transform = _ref.transform;
  var _ref$format = _ref.format;
  var format = _ref$format === undefined ? identity : _ref$format;
  var _ref$translate = _ref.translate;
  var translate = _ref$translate === undefined ? origin : _ref$translate;
  var children = _ref.children;

  var props = _objectWithoutProperties(_ref, ['x', 'y', 'transform', 'format', 'translate', 'children']);

  var labelText = children ? format(children) : children;
  return _react2['default'].createElement(
    'g',
    {
      transform: transform
    },
    _react2['default'].createElement(
      'text',
      _extends({
        x: x,
        y: y,
        fontSize: fontSize,
        transform: 'translate(' + String(translate.x) + ' ' + String(translate.y) + ')'
      }, props),
      labelText
    )
  );
}

Label.propTypes = {
  children: _react.PropTypes.any,
  format: _react.PropTypes.func,
  transform: _react.PropTypes.string,
  translate: _react.PropTypes.shape({
    x: _react.PropTypes.number,
    y: _react.PropTypes.number
  }),
  x: _react.PropTypes.number,
  y: _react.PropTypes.number
};