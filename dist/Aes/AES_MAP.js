'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ALGORITHM = void 0;

var _Aes256GCM = require("./Aes256GCM");

var _Aes256CBC = require("./Aes256CBC");

var ALGORITHM = {
  'aes-256-gcm': _Aes256GCM.Aes256GCM,
  'aes-256-cbc': _Aes256CBC.Aes256CBC
};
exports.ALGORITHM = ALGORITHM;