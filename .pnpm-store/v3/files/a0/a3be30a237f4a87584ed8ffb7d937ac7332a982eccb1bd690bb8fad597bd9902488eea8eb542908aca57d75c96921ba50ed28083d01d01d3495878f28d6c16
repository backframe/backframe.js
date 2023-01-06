'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.Chart = Chart;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var defaultPadding = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10
};

function Chart(_ref) {
  var _ref$width = _ref.width;
  var width = _ref$width === undefined ? 300 : _ref$width;
  var _ref$height = _ref.height;
  var height = _ref$height === undefined ? 150 : _ref$height;
  var _padding = _ref._padding;
  var children = _ref.children;

  var props = _objectWithoutProperties(_ref, ['width', 'height', '_padding', 'children']);

  var padding = _extends({}, defaultPadding, _padding);
  var innerWidth = width - (padding.left + padding.right);
  var innerHeight = height - (padding.top + padding.bottom);

  var components = _react.Children.map(children, function (component) {
    var childrenProps = { width: innerWidth, heigth: innerHeight };
    return (0, _react.cloneElement)(component, childrenProps);
  });

  return _react2['default'].createElement(
    'svg',
    _extends({
      width: width,
      height: height
    }, props),
    _react2['default'].createElement(
      'g',
      {
        transform: 'translate(' + String(padding.left) + ' ' + String(padding.top) + ')'
      },
      components
    )
  );
}

Chart.propTypes = {
  children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.element), _react.PropTypes.element]),
  _padding: _react.PropTypes.shape({
    top: _react.PropTypes.number,
    right: _react.PropTypes.number,
    bottom: _react.PropTypes.number,
    left: _react.PropTypes.number
  }),
  width: _react.PropTypes.number,
  height: _react.PropTypes.number
};