'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _autoBind = _interopRequireDefault(require("auto-bind"));

var _ResponseBody = _interopRequireDefault(require("./ResponseBody"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var ERROR_NAME = 'CryptoError';
var ERROR_CLASSIFICATION = 'CRYTOGRAPHIC_ERROR';
var STATUS_CODE = 500;
var CAN_CAPTURE = typeof Error.captureStackTrace === 'function';
var CAN_STACK = !!new Error().stack;

class CryptoError extends Error {
  constructor(error, source, message) {
    var {
      _isCryptoError,
      message: _message,
      msg,
      name,
      source: errSource,
      statusCode,
      error: err,
      stack
    } = error || {};

    var _msg = msg || _message || message;

    super(_msg);
    this._isCryptoError = true;
    this.name = name || ERROR_NAME;
    this.classification = ERROR_CLASSIFICATION;
    this.source = _isCryptoError && errSource || source;
    this.message = _msg;
    this.msg = _msg;
    this.statusCode = _isCryptoError && statusCode || STATUS_CODE;
    this.error = !_isCryptoError && error || err || undefined;
    var thisErrorHasKeys = !!Object.keys(this.error || {}).length;

    if (!thisErrorHasKeys) {
      this.error = undefined;
    }

    this.stack = stack || CAN_CAPTURE && Error.captureStackTrace(this, CryptoError) || CAN_STACK && new Error().stack || undefined;
    (0, _autoBind.default)(this);
  }

  getResponseBody() {
    var {
      statusCode,
      message
    } = this;
    var error = this.toJSON();
    var {
      NODE_ENV
    } = process.env;
    error.stack = NODE_ENV === 'production' && undefined || error.stack;
    return new _ResponseBody.default(statusCode, message, undefined, error);
  }

  toJSON() {
    var _this = this,
        {
      toJSON
    } = _this,
        rest = _objectWithoutProperties(_this, ["toJSON"]);

    return JSON.parse(JSON.stringify(rest));
  }

}

exports.default = CryptoError;