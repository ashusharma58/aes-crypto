'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AesUtils = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _randomstring = _interopRequireDefault(require("randomstring"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AesUtils = {
  generateKey,
  extractKeyFromToken,
  generatePublicKey,
  generatePrivateKey
};
exports.AesUtils = AesUtils;

function generateKey() {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
  return _randomstring.default.generate(length);
}

function extractKeyFromToken() {
  var token = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var [,, checksum] = token.split('.');
  var checksumLength = checksum.length;
  var eKey1 = checksum.substring(0, 16);
  var eKey2 = checksum.substring(checksumLength - 16);
  var encryptionKey = [eKey1, eKey2].join('');
  return encryptionKey;
}

function generatePublicKey() {
  var outputFormat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'base64';

  var ecdh = _crypto.default.createECDH('secp256k1');

  var publicKey = ecdh.generateKeys(outputFormat);
  return {
    ecdh,
    publicKey
  };
}

function generatePrivateKey(ecdh, publicKey) {
  var outputFormat = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'base64';
  var key = ecdh.computeSecret(publicKey, outputFormat);
  return key.toString(outputFormat);
}