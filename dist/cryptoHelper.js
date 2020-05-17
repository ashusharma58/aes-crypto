'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _randomstring = _interopRequireDefault(require("randomstring"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cryptoHelper = {
  randomBytes,
  randomString
};
var _default = cryptoHelper;
exports.default = _default;

function randomBytes() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  var format = arguments.length > 1 ? arguments[1] : undefined;

  var random = _crypto.default.randomBytes(length);

  random = format && random.toString(format) || random;
  return random;
}

function randomString() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  return _randomstring.default.generate(length);
}