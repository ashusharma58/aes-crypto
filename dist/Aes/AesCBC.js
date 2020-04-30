'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _CryptoError = _interopRequireDefault(require("../CryptoError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ALGORITHMS = ['aes-128-cbc', 'aes-256-cbc'];
var AesCBC = {
  ALGORITHMS,
  encrypt,
  decrypt
};
var _default = AesCBC;
exports.default = _default;
var DEFAULT_OPTIONS = {
  outputFormat: 'hex',
  uriEncode: false
};

function encrypt(algorithm) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_OPTIONS;
  var {
    key = '',
    data = ''
  } = params;
  var {
    outputFormat = DEFAULT_OPTIONS.outputFormat,
    uriEncode = DEFAULT_OPTIONS.uriEncode
  } = options;

  if (typeof key !== 'string' || !key) {
    throw new _CryptoError.default(algorithm, "Provided 'key' must be a non-empty string");
  }

  if (typeof data !== 'string' || !data) {
    throw new _CryptoError.default(algorithm, "Provided 'data' must be a non-empty string");
  }

  try {
    var ivBuffer = _crypto.default.randomBytes(16);

    var ivString = ivBuffer.toString(outputFormat);

    var encryptor = _crypto.default.createCipheriv(algorithm, key, ivBuffer);

    var cipherText = encryptor.update(data, 'utf8', outputFormat);
    cipherText += encryptor.final(outputFormat);
    cipherText = [ivString, cipherText].join('.');

    if (uriEncode) {
      cipherText = encodeURIComponent(cipherText);
    }

    return cipherText;
  } catch (e) {
    throw new _CryptoError.default(algorithm, '', e);
  }
}

function decrypt(algorithm) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : DEFAULT_OPTIONS;
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
    throw new _CryptoError.default(algorithm, "Provided 'key' must be a non-empty string");
  }

  if (typeof data !== 'string' || !data) {
    throw new _CryptoError.default(algorithm, "Provided 'data' must be a non-empty string");
  }

  try {
    if (uriEncode) {
      encryptedData = decodeURIComponent(data);
    }

    encryptedData = encryptedData.split('.');

    if (encryptedData.length !== 2) {
      throw new _CryptoError.default(algorithm, 'Invalid Encrypted Data');
    }

    var [iv, cipherText] = encryptedData;
    var ivBuffer = Buffer.from(iv, outputFormat);
    var keyBuffer = Buffer.from(key);

    var decryptor = _crypto.default.createDecipheriv(algorithm, keyBuffer, ivBuffer);

    var decryptedText = decryptor.update(cipherText, outputFormat, 'utf8');
    decryptedText += decryptor.final('utf8');
    return decryptedText;
  } catch (e) {
    throw new _CryptoError.default(algorithm, '', e);
  }
}