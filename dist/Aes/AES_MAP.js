'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALGORITHMS = void 0;

var _AesCBC = _interopRequireDefault(require("./AesCBC"));

var _AesGCM = _interopRequireDefault(require("./AesGCM"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var {
  ALGORITHMS: CBC_ALGORITHM
} = _AesCBC.default;
var {
  ALGORITHMS: GCM_ALGORITHM
} = _AesGCM.default;
var ALGORITHMS = {};
exports.ALGORITHMS = ALGORITHMS;
CBC_ALGORITHM.forEach(algorithm => {
  ALGORITHMS[algorithm] = _AesCBC.default;
});
GCM_ALGORITHM.forEach(algorithm => {
  ALGORITHMS[algorithm] = _AesGCM.default;
});