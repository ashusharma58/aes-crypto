'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _AES_MAP = require("./AES_MAP");

var _CryptoError = _interopRequireDefault(require("../CryptoError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Aes = {
  encrypt,
  decrypt
};
var _default = Aes;
exports.default = _default;

function encrypt(algorithom, params, options) {
  try {
    if (typeof algorithom !== 'string' || !algorithom) {
      throw new TypeError('Provided "algorithom" must be a non-empty string');
    }

    var crypto = _AES_MAP.ALGORITHMS[algorithom];

    if (!crypto) {
      throw new TypeError("Unprocessable AES Algorithm: ".concat(algorithom));
    }

    return crypto.encrypt(algorithom, params, options);
  } catch (e) {
    throw new _CryptoError.default(e);
  }
}

function decrypt(algorithom, params, options) {
  try {
    if (typeof algorithom !== 'string' || !algorithom) {
      throw new TypeError('Provided "algorithom" must be a non-empty string');
    }

    var crypto = _AES_MAP.ALGORITHMS[algorithom];

    if (!crypto) {
      throw new TypeError("Unprocessable AES Algorithm: ".concat(algorithom));
    }

    return crypto.decrypt(algorithom, params, options);
  } catch (e) {
    throw new _CryptoError.default(e);
  }
}