'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _openpgp = _interopRequireDefault(require("openpgp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var DEFAULT_PASSPHRASE = 'Batman';
var PgpUtils = {
  generateKeys
};
var _default = PgpUtils;
exports.default = _default;

function generateKeys(_x) {
  return _generateKeys.apply(this, arguments);
}

function _generateKeys() {
  _generateKeys = _asyncToGenerator(function* (params) {
    var {
      userIds = [],
      numBits = 2048,
      passphrase = DEFAULT_PASSPHRASE
    } = params;

    if (!(userIds instanceof Array) || !userIds.length) {
      throw new Error('Provided "userIds" must be a non-empty Array');
    }

    var options = {
      userIds,
      numBits,
      passphrase
    };
    var keys = yield _openpgp.default.generateKey(options);
    return keys;
  });
  return _generateKeys.apply(this, arguments);
}