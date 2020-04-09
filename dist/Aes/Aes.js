'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Aes = void 0;

var _AES_MAP = require("./AES_MAP");

var _CryptoError = require("../CryptoError");

var Aes = {
  encrypt,
  decrypt
};
exports.Aes = Aes;

function encrypt(algorithom, params, options) {
  try {
    if (typeof algorithom !== 'string' || !algorithom) {
      throw new TypeError('Provided "algorithom" must be a non-empty string');
    }

    var crypto = _AES_MAP.ALGORITHM[algorithom];

    if (!crypto) {
      throw new TypeError("Unprocessable AES Algorithm: ".concat(algorithom));
    }

    return crypto.encrypt(params, options);
  } catch (e) {
    throw new _CryptoError.CryptoError(e);
  }
}

function decrypt(algorithom, params, options) {
  try {
    if (typeof algorithom !== 'string' || !algorithom) {
      throw new TypeError('Provided "algorithom" must be a non-empty string');
    }

    var crypto = _AES_MAP.ALGORITHM[algorithom];

    if (!crypto) {
      throw new TypeError("Unprocessable AES Algorithm: ".concat(algorithom));
    }

    return crypto.decrypt(params, options);
  } catch (e) {
    throw new _CryptoError.CryptoError(e);
  }
}