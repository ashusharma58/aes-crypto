'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomError = void 0;

class CustomError extends Error {
  constructor(message) {
    super(message);
    Error.captureStackTrace(this, CustomError);

    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }

    var [name] = params;
    this.name = name || 'CustomError';
    this.message = message;
    this.errorMessage = message;
  }

}

exports.CustomError = CustomError;