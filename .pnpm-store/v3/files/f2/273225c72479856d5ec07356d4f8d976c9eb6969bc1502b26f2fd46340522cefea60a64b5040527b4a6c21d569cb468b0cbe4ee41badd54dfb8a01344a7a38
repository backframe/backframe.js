'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.componentType = componentType;

var _react = require('react');

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