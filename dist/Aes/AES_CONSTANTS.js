'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AES_CBC_ALGORITHMS = ['aes-128-cbc', 'aes-256-cbc'];
var AES_GCM_ALGORITHMS = ['aes-128-gcm', 'aes-256-gcm'];
var KEY_LENGTH_MAP = {
  'aes-128-cbc': 16,
  'aes-256-cbc': 32,
  'aes-128-gcm': 16,
  'aes-256-gcm': 32
};
var KDF = {
  PBKDF2: 'PBKDF2'
};
var KDF_MAP = {
  [KDF.PBKDF2]: _crypto.default.pbkdf2Sync
};
var DEFAULT_AES_OPTIONS = {
  keyFormat: 'hex',
  ivFormat: 'hex',
  saltFormat: 'hex',
  cipherTextFormat: 'hex',
  plainTextFormat: 'utf8',
  dataSeparator: '.',
  deriveKey: false,
  appendSalt: false,
  kdf: KDF.PBKDF2,
  saltLength: 20,
  ivLength: 16,
  kdfIterations: 50,
  kdfDigest: 'sha1',
  authTagLength: 16
};
var AES_CONSTANTS = {
  AES_CBC_ALGORITHMS,
  AES_GCM_ALGORITHMS,
  KEY_LENGTH_MAP,
  KDF,
  KDF_MAP,
  DEFAULT_AES_OPTIONS
};
var _default = AES_CONSTANTS;
exports.default = _default;