(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("React"), require("d3"));
	else if(typeof define === 'function' && define.amd)
		define(["React", "d3"], factory);
	else if(typeof exports === 'object')
		exports["Yum"] = factory(require("React"), require("d3"));
	else
		root["Yum"] = factory(root["React"], root["d3"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_10__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _charts = __webpack_require__(9);

	Object.defineProperty(exports, 'charts', {
	  enumerable: true,
	  get: function () {
	    function get() {
	      return _interopRequireDefault(_charts)['default'];
	    }

	    return get;
	  }()
	});

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.componentType = componentType;

	var _react = __webpack_require__(1);

	function componentType(component) {
	  return function (props, propName, componentName) {
	    var error = void 0;
	    var prop = props[propName];

	    _react.Children.forEach(prop, function (child) {
	      if (child.type.name !== component.name) {
	        error = new Error('`' + String(componentName) + '` only accepts children of type `' + String(component.name) + '`.');
	      }
	    });

	    return error;
	  };
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.Label = Label;

	var _react = __webpack_require__(1);

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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.Tick = Tick;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _proptypes = __webpack_require__(2);

	var _Label = __webpack_require__(3);

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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.Tooltip = Tooltip;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function Tooltip(_ref) {
	  var x = _ref.x;
	  var y = _ref.y;
	  var children = _ref.children;

	  var props = _objectWithoutProperties(_ref, ['x', 'y', 'children']);

	  return _react2['default'].createElement(
	    'text',
	    _extends({
	      x: x,
	      y: y
	    }, props),
	    children
	  );
	}

	Tooltip.propTypes = {
	  children: _react.PropTypes.oneOfType([_react.PropTypes.arrayOf(_react.PropTypes.element), _react.PropTypes.element, _react.PropTypes.string]),
	  x: _react.PropTypes.number,
	  y: _react.PropTypes.number,
	  width: _react.PropTypes.number,
	  height: _react.PropTypes.number
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.Axis = Axis;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _proptypes = __webpack_require__(2);

	var _Tick = __webpack_require__(4);

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

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.Chart = Chart;

	var _react = __webpack_require__(1);

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

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	exports.Line = Line;

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _d = __webpack_require__(10);

	var _d2 = _interopRequireDefault(_d);

	var _Tooltip = __webpack_require__(5);

	var _proptypes = __webpack_require__(2);

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

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Axis = __webpack_require__(6);

	var _Chart = __webpack_require__(7);

	var _Label = __webpack_require__(3);

	var _Line = __webpack_require__(8);

	var _Tick = __webpack_require__(4);

	var _Tooltip = __webpack_require__(5);

	exports['default'] = {
	  Axis: _Axis.Axis,
	  Chart: _Chart.Chart,
	  Label: _Label.Label,
	  Line: _Line.Line,
	  Tick: _Tick.Tick,
	  Tooltip: _Tooltip.Tooltip
	};
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_10__;

/***/ }
/******/ ])
});
;