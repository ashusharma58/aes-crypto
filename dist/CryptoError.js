'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CryptoError = void 0;

var _http = _interopRequireDefault(require("http"));

var _CustomError = require("./CustomError");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ERROR_NAME = 'CryptoError';

class CryptoError extends _CustomError.CustomError {
  constructor(error) {
    var {
      message,
      statusCode = 500
    } = error;

    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    var [algorithm = ''] = params;
    super(message, ERROR_NAME);
    this.algorithm = algorithm;
    this.statusCode = statusCode;
    this.status = _http.default.STATUS_CODES[statusCode];
  }

}

exports.CryptoError = CryptoError;