'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _randomstring = _interopRequireDefault(require("randomstring"));

var _AES_CONSTANTS = _interopRequireDefault(require("./AES_CONSTANTS"));

var _CryptoError = _interopRequireDefault(require("../CryptoError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SOURCE = 'Aes-Utils';
var AesUtils = {
  generateKey,
  deriveKey,
  extractKeyFromToken
};
var _default = AesUtils;
exports.default = _default;

function generateKey() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  return _randomstring.default.generate(length);
}

function deriveKey(masterKey, saltBuffer, keyLength, options) {
  var {
    KDF
  } = _AES_CONSTANTS.default;
  var {
    kdf,
    kdfIterations,
    kdfDigest
  } = options;
  var derivedKeyBuffer;

  switch (kdf) {
    case KDF.PBKDF2:
      derivedKeyBuffer = _crypto.default.pbkdf2Sync(masterKey, saltBuffer, kdfIterations, keyLength, kdfDigest);
      break;

    default:
      throw new _CryptoError.default(null, SOURCE, "Cannot Derive Key with KDF '".concat(kdf, "'"));
  }

  return derivedKeyBuffer;
}

function extractKeyFromToken() {
  var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var keyLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 32;
  // const [,, checksum] = token.split('.')
  // const checksumLength = checksum.length
  // const eKey1 = checksum.substring(0, 16)
  // const eKey2 = checksum.substring(checksumLength-16)
  // const encryptionKey = [eKey1, eKey2].join('')
  // return encryptionKey
  var {
    DEFAULT_AES_OPTIONS
  } = _AES_CONSTANTS.default;
  var {
    kdfIterations,
    kdfDigest,
    keyFormat
  } = DEFAULT_AES_OPTIONS;
  var [header,, checksum] = token.split('.');
  var saltBuffer = Buffer.from(header);

  var derivedKeyBuffer = _crypto.default.pbkdf2Sync(checksum, saltBuffer, kdfIterations, keyLength, kdfDigest);

  var derivedKey = derivedKeyBuffer.toString(keyFormat);
  return derivedKey;
}