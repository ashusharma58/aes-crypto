'use strict';

var AesExports = _interopRequireWildcard(require("./Aes"));

var NaClExports = _interopRequireWildcard(require("./NaCl"));

var PgpExports = _interopRequireWildcard(require("./Pgp"));

var _ResponseBody = _interopRequireDefault(require("./ResponseBody"));

var _cryptoHelper = _interopRequireDefault(require("./cryptoHelper"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var exportProps = {};
Object.assign(exportProps, AesExports, NaClExports, PgpExports, {
  ResponseBody: _ResponseBody.default,
  cryptoHelper: _cryptoHelper.default,
  default: undefined
});
module.exports = exportProps;