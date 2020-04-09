'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NaClBox = void 0;

var _tweetnacl = require("tweetnacl");

var _tweetnaclUtil = require("tweetnacl-util");

var _NaClUtils = require("./NaClUtils");

var _CryptoError = require("../CryptoError");

var ALGORITHM = 'NaCl';
var NaClBox = {
  encrypt,
  decrypt
};
exports.NaClBox = NaClBox;

function encrypt(publicKey, secretKey, data) {
  var key = _NaClUtils.NaClUtils.generateKey(publicKey, secretKey);

  var nonce = _NaClUtils.NaClUtils.generateNonce();

  var dataString = JSON.stringify(data);
  var dataUint8 = (0, _tweetnaclUtil.decodeUTF8)(dataString);

  var encryptedData = _tweetnacl.box.after(dataUint8, nonce, key);

  var fullMessage = new Uint8Array(nonce.length + encryptedData.length);
  fullMessage.set(nonce);
  fullMessage.set(encryptedData, nonce.length);
  var base64FullMessage = (0, _tweetnaclUtil.encodeBase64)(fullMessage);
  return base64FullMessage;
}

function decrypt(publicKey, secretKey, data) {
  var key = _NaClUtils.NaClUtils.generateKey(publicKey, secretKey);

  var dataWithNonceAsUint8Array = (0, _tweetnaclUtil.decodeBase64)(data);
  var nonce = dataWithNonceAsUint8Array.slice(0, _tweetnacl.box.nonceLength);
  var encryptedData = dataWithNonceAsUint8Array.slice(_tweetnacl.box.nonceLength, data.length);

  var decryptedData = _tweetnacl.box.open.after(encryptedData, nonce, key);

  if (decryptedData === null) {
    var e = new Error('Error Decrypting Data');
    throw new _CryptoError.CryptoError(e, ALGORITHM);
  }

  var base64DecryptedData = (0, _tweetnaclUtil.encodeUTF8)(decryptedData);

  try {
    var jsonData = JSON.parse(base64DecryptedData);
    return jsonData;
  } catch (e) {
    return base64DecryptedData;
  }
}