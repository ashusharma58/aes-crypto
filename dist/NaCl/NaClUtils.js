'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NaClUtils = void 0;

var _tweetnacl = require("tweetnacl");

var _tweetnaclUtil = require("tweetnacl-util");

var NaClUtils = {
  generateKeyPair,
  generateKey,
  generateNonce
};
exports.NaClUtils = NaClUtils;

function generateKeyPair() {
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
}

function generateKey(publicKeyString, secretKeyString) {
  var publicKey = (0, _tweetnaclUtil.decodeBase64)(publicKeyString);
  var secretKey = (0, _tweetnaclUtil.decodeBase64)(secretKeyString);
  return _tweetnacl.box.before(publicKey, secretKey);
}

function generateNonce() {
  return (0, _tweetnacl.randomBytes)(_tweetnacl.box.nonceLength);
}