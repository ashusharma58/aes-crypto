'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _randomstring = _interopRequireDefault(require("randomstring"));

var _CryptoError = _interopRequireDefault(require("./CryptoError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cryptoHelper = {
  randomBytes,
  randomString,
  generateKey
};
var _default = cryptoHelper;
exports.default = _default;

function randomBytes() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  var format = arguments.length > 1 ? arguments[1] : undefined;

  var random = _crypto.default.randomBytes(length);

  random = format && random.toString(format) || random;
  return random;
}

function randomString() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  return _randomstring.default.generate(length);
}

function generateKey() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var source = 'cryptoHelper::generateKey';
  var {
    masterKey,
    saltBuffer,
    keyBufferLength = 32,
    keyFormat = 'hex'
  } = params;
  var {
    kdf,
    kdfIterations = 50,
    kdfDigest = 'sha256'
  } = options;
  var returnObj = {};
  var key;

  if (kdf && !masterKey) {
    throw new _CryptoError.default(null, source, "Missing 'masterKey' params for provided KDF '".concat(kdf, "'"));
  }

  switch (kdf) {
    case 'PBKDF2':
      var _saltBuffer = saltBuffer || randomBytes(16);

      key = _crypto.default.pbkdf2Sync(masterKey, _saltBuffer, kdfIterations, keyBufferLength, kdfDigest);
      key = key.toString(keyFormat);
      returnObj = {
        saltBuffer: _saltBuffer,
        key
      };
      break;

    default:
      key = randomBytes(keyBufferLength, keyFormat);
      returnObj = {
        key
      };
  }

  return returnObj;
}