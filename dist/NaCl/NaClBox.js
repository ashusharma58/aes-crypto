'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NaClBox = void 0;

var _tweetnacl = require("tweetnacl");

var _tweetnaclUtil = require("tweetnacl-util");

var _NaClUtils = require("./NaClUtils");

var _CryptoError = _interopRequireDefault(require("../CryptoError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ALGORITHM = 'NaCl-Box';
var NaClBox = {
  encrypt,
  decrypt
};
exports.NaClBox = NaClBox;

function encrypt(publicKey, secretKey, data) {
  var key = _NaClUtils.NaClUtils.generateKey(publicKey, secretKey);

  var nonce = _NaClUtils.NaClUtils.generateNonce();

  try {
    var dataString = JSON.stringify(data);
    var dataUint8 = (0, _tweetnaclUtil.decodeUTF8)(dataString);

    var encryptedData = _tweetnacl.box.after(dataUint8, nonce, key);

    var fullMessage = new Uint8Array(nonce.length + encryptedData.length);
    fullMessage.set(nonce);
    fullMessage.set(encryptedData, nonce.length);
    var base64FullMessage = (0, _tweetnaclUtil.encodeBase64)(fullMessage);
    return base64FullMessage;
  } catch (e) {
    throw new _CryptoError.default(ALGORITHM, '', e);
  }
}

function decrypt(publicKey, secretKey, data) {
  var key = _NaClUtils.NaClUtils.generateKey(publicKey, secretKey);

  try {
    var dataWithNonceAsUint8Array = (0, _tweetnaclUtil.decodeBase64)(data);
    var nonce = dataWithNonceAsUint8Array.slice(0, _tweetnacl.box.nonceLength);
    var encryptedData = dataWithNonceAsUint8Array.slice(_tweetnacl.box.nonceLength, data.length);

    var decryptedData = _tweetnacl.box.open.after(encryptedData, nonce, key);

    if (decryptedData === null) {
      throw new _CryptoError.default(ALGORITHM, 'Error Decrypting Data');
    }

    var base64DecryptedData = (0, _tweetnaclUtil.encodeUTF8)(decryptedData);

    try {
      var jsonData = JSON.parse(base64DecryptedData);
      return jsonData;
    } catch (e) {
      return base64DecryptedData;
    }
  } catch (e) {
    throw new _CryptoError.default(ALGORITHM, '', e);
  }
}