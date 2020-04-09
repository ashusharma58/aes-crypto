'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResponseBody = void 0;

var _http = _interopRequireDefault(require("http"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ResponseBody {
  constructor(statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = message || _http.default.STATUS_CODES[statusCode];
    this.data = data;
  }

}

exports.ResponseBody = ResponseBody;