'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALGORITHM = void 0;

var _AesCBC = _interopRequireDefault(require("./AesCBC"));

var _AesGCM = _interopRequireDefault(require("./AesGCM"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var {
  ALGORITHMS: CBC_ALGORITHM
} = _AesCBC.default;
var {
  ALGORITHMS: GCM_ALGORITHM
} = _AesGCM.default;
var ALGORITHM = {};
exports.ALGORITHM = ALGORITHM;
CBC_ALGORITHM.forEach(algorithm => ALGORITHM[algorithm] = _AesCBC.default);
GCM_ALGORITHM.forEach(algorithm => ALGORITHM[algorithm] = _AesGCM.default);