'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NaClUtils = void 0;

var _tweetnacl = require("tweetnacl");

var _tweetnaclUtil = require("tweetnacl-util");

var _CryptoError = _interopRequireDefault(require("../CryptoError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ENTITY = 'NaCl-Utils';
var NaClUtils = {
  generateKeyPair,
  generateKey,
  generateNonce
};
exports.NaClUtils = NaClUtils;

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
    throw new _CryptoError.default(ENTITY, 'Error Generating Key Pair', e);
  }
}

function generateKey(publicKeyString, secretKeyString) {
  try {
    var publicKey = (0, _tweetnaclUtil.decodeBase64)(publicKeyString);
    var secretKey = (0, _tweetnaclUtil.decodeBase64)(secretKeyString);
    return _tweetnacl.box.before(publicKey, secretKey);
  } catch (e) {
    throw new _CryptoError.default(ENTITY, 'Error Generating Key', e);
  }
}

function generateNonce() {
  try {
    return (0, _tweetnacl.randomBytes)(_tweetnacl.box.nonceLength);
  } catch (e) {
    throw new _CryptoError.default(ENTITY, 'Error Generating Nonce', e);
  }
}