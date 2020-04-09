'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _openpgp = _interopRequireWildcard(require("openpgp"));

var _PgpUtils = _interopRequireDefault(require("./PgpUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var Pgp = {
  encrypt,
  decrypt
};
var DEFAULT_OPTIONS = {};
var _default = Pgp;
exports.default = _default;

function encrypt() {
  return _encrypt.apply(this, arguments);
}

function _encrypt() {
  _encrypt = _asyncToGenerator(function* () {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_OPTIONS;
    var {
      data = {},
      publicKeyArmored = '',
      passphrase = '',
      userIds = []
    } = params;
    var dataString = JSON.stringify(data);

    if (typeof publicKeyArmored !== 'string' || !publicKeyArmored) {
      throw new Error('Provided "publicKeyArmored" must be a non-empty string');
    }

    if (typeof passphrase !== 'string' || !passphrase) {
      throw new Error('Provided "passphrase" must be a non-empty string');
    }

    var keyGenOpts = {
      userIds,
      passphrase
    };
    var newKeys = yield _PgpUtils.default.generateKeys(keyGenOpts);
    var {
      privateKeyArmored
    } = newKeys;
    var {
      keys: [privateKey]
    } = yield _openpgp.key.readArmored(privateKeyArmored);
    yield privateKey.decrypt(passphrase);

    var msg = _openpgp.message.fromText(dataString);

    var publicKeys = (yield _openpgp.key.readArmored(publicKeyArmored)).keys;
    var encryptionOpts = {
      message: msg,
      publicKeys,
      privateKeys: [privateKey]
    };
    var {
      data: encryptedData
    } = yield _openpgp.default.encrypt(encryptionOpts);
    return {
      payload: encryptedData,
      publicKeyArmored: newKeys.publicKeyArmored
    };
  });
  return _encrypt.apply(this, arguments);
}

function decrypt() {
  return _decrypt.apply(this, arguments);
}

function _decrypt() {
  _decrypt = _asyncToGenerator(function* () {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_OPTIONS;
    var {
      data = {},
      privateKeyArmored = '',
      passphrase = ''
    } = params;

    if (typeof privateKeyArmored !== 'string' || !privateKeyArmored) {
      throw new Error('Provided "privateKeyArmored" must be a non-empty string');
    }

    if (typeof passphrase !== 'string' || !passphrase) {
      throw new Error('Provided "passphrase" must be a non-empty string');
    }

    var {
      payload,
      publicKeyArmored
    } = data;

    if (!payload || !publicKeyArmored) {
      return {};
    }

    var {
      keys: [privateKey]
    } = yield _openpgp.key.readArmored(privateKeyArmored);
    yield privateKey.decrypt(passphrase);
    var msg = yield _openpgp.message.readArmored(payload);
    var publicKeys = (yield _openpgp.key.readArmored(publicKeyArmored)).keys;
    var decryptionOpts = {
      message: msg,
      publicKeys,
      privateKeys: [privateKey]
    };
    var {
      data: decryptedData
    } = yield _openpgp.default.decrypt(decryptionOpts);
    var jsonData = JSON.parse(decryptedData);
    return jsonData;
  });
  return _decrypt.apply(this, arguments);
}