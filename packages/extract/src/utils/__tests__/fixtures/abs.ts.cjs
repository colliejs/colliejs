"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.small = exports.pos = exports.flex = exports.big = exports.abs = void 0;
var _base = require("./base");
var abs = function abs(x) {
  return {
    position: x
  };
};
exports.abs = abs;
var flex = {
  display: 'flex'
};
exports.flex = flex;
var big = '100px';
exports.big = big;
var small = _base.FIX_NUMBER;
exports.small = small;
var pos = function pos(x) {
  return {
    position: x
  };
};
exports.pos = pos;