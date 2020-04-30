'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ResponseBody = _interopRequireDefault(require("./ResponseBody"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STATUS_CODE = 500;

class CryptoError extends Error {
  constructor(entity, message, error) {
    super(message);
    Error.captureStackTrace(this, CryptoError);
    this.name = "CryptoError(".concat(entity.toUpperCase(), ")");
    this.statusCode = STATUS_CODE;
    this.message = message || error.message;
    this.error = error.constructor.name !== 'CryptoError' && error || undefined;
  }

  getResponseBody() {
    var {
      statusCode,
      message,
      error
    } = this;
    return new _ResponseBody.default(statusCode, message, undefined, error);
  }

}

exports.default = CryptoError;