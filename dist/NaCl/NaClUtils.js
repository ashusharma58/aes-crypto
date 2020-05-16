'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tweetnacl = require("tweetnacl");

var _tweetnaclUtil = require("tweetnacl-util");

var _CryptoError = _interopRequireDefault(require("../CryptoError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SOURCE = 'NaCl::Utils';
var NaClUtils = {
  generateKeyPair,
  generateKey,
  generateNonce
};
var _default = NaClUtils;
exports.default = _default;

function generateKeyPair() {
  try {
    var keyPair = _tweetnacl.box.keyPair();

    var {
      publicKey,
      secretKey
    } = keyPair;
    var publicKeyString = (0, _tweetnaclUtil.encodeBase64)(publicKey);
    var secretKeyString = (0, _tweetnaclUtil.encodeBase64)(secretKey);
    return {
      publicKey: publicKeyString,
      secretKey: secretKeyString
    };
  } catch (e) {
    throw new _CryptoError.default(e, SOURCE, 'Error Generating Key Pair');
  }
}

function generateKey(publicKeyString, secretKeyString) {
  try {
    var publicKey = (0, _tweetnaclUtil.decodeBase64)(publicKeyString);
    var secretKey = (0, _tweetnaclUtil.decodeBase64)(secretKeyString);
    return _tweetnacl.box.before(publicKey, secretKey);
  } catch (e) {
    throw new _CryptoError.default(e, SOURCE, 'Error Generating Key');
  }
}

function generateNonce() {
  try {
    return (0, _tweetnacl.randomBytes)(_tweetnacl.box.nonceLength);
  } catch (e) {
    throw new _CryptoError.default(e, SOURCE, 'Error Generating Nonce');
  }
}