'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Aes256CBC = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _CryptoError = require("../CryptoError");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ALGORITHM = 'aes-256-cbc';
var Aes256CBC = {
  encrypt,
  decrypt
};
exports.Aes256CBC = Aes256CBC;
var DEFAULT_OPTIONS = {
  outputFormat: 'hex',
  uriEncode: false
};

function encrypt() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_OPTIONS;

  try {
    var {
      key = '',
      data = ''
    } = params;
    var {
      outputFormat = DEFAULT_OPTIONS.outputFormat,
      uriEncode = DEFAULT_OPTIONS.uriEncode
    } = options;

    if (typeof key !== 'string' || !key) {
      throw new Error('Provided "key" must be a non-empty string');
    }

    if (typeof data !== 'string' || !data) {
      throw new Error('Provided "data" must be a non-empty string');
    }

    var ivBuffer = _crypto.default.randomBytes(16);

    var ivString = ivBuffer.toString(outputFormat);

    var encryptor = _crypto.default.createCipheriv(ALGORITHM, key, ivBuffer);

    var cipherText = encryptor.update(data, 'utf8', outputFormat);
    cipherText += encryptor.final(outputFormat);
    cipherText = [ivString, cipherText].join('.');

    if (uriEncode) {
      cipherText = encodeURIComponent(cipherText);
    }

    return cipherText;
  } catch (e) {
    throw new _CryptoError.CryptoError(e, ALGORITHM);
  }
}

function decrypt() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_OPTIONS;

  try {
    var {
      key = '',
      data = ''
    } = params;
    var {
      outputFormat = DEFAULT_OPTIONS.outputFormat,
      uriEncode = DEFAULT_OPTIONS.uriEncode
    } = options;
    var encryptedData = data;

    if (typeof key !== 'string' || !key) {
      throw new Error('Provided "key" must be a non-empty string');
    }

    if (typeof data !== 'string' || !data) {
      throw new Error('Provided "data" must be a non-empty string');
    }

    if (uriEncode) {
      encryptedData = decodeURIComponent(data);
    }

    encryptedData = encryptedData.split('.');

    if (encryptedData.length !== 2) {
      throw new Error('Invalid Encrypted Data');
    }

    var [iv, cipherText] = encryptedData;
    var ivBuffer = Buffer.from(iv, outputFormat);
    var keyBuffer = Buffer.from(key);

    var decryptor = _crypto.default.createDecipheriv(ALGORITHM, keyBuffer, ivBuffer);

    var decryptedText = decryptor.update(cipherText, outputFormat, 'utf8');
    decryptedText += decryptor.final('utf8');
    return decryptedText;
  } catch (e) {
    throw new _CryptoError.CryptoError(e, ALGORITHM);
  }
}