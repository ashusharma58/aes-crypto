'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

var _CryptoError = _interopRequireDefault(require("../CryptoError"));

var _AES_CONSTANTS = _interopRequireDefault(require("./AES_CONSTANTS"));

var _AesUtils = _interopRequireDefault(require("./AesUtils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var {
  AES_GCM_ALGORITHMS: ALGORITHMS,
  DEFAULT_AES_OPTIONS: DEFAULT_OPTIONS,
  KEY_LENGTH_MAP
} = _AES_CONSTANTS.default;
var AesGCM = {
  ALGORITHMS,
  encrypt,
  decrypt
};
var _default = AesGCM;
exports.default = _default;

function encrypt(algorithm) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var source = "".concat(algorithm, "::encrypt");
  var {
    data = ''
  } = params;

  var options = _objectSpread({}, DEFAULT_OPTIONS, {}, _options);

  var {
    cipherTextFormat,
    plainTextFormat,
    deriveKey
  } = options;
  validateEncryptOptions(source, params, options);

  try {
    var keyObj = getKey(algorithm, params, options);
    var ivObj = getEncryptIV(params, options);
    var {
      buffer: keyBuffer,
      saltObj
    } = keyObj;
    var {
      string: saltString
    } = saltObj || {};
    var {
      buffer: ivBuffer,
      string: ivString
    } = ivObj;

    var encryptor = _crypto.default.createCipheriv(algorithm, keyBuffer, ivBuffer);

    var cipherTextBuffer = Buffer.concat([encryptor.update(data, plainTextFormat), encryptor.final()]);
    var cipherTextString = cipherTextBuffer.toString(cipherTextFormat);
    var cipherTextObj = {
      buffer: cipherTextBuffer,
      string: cipherTextString
    };
    var authTagBuffer = encryptor.getAuthTag();
    var authTagString = authTagBuffer.toString(cipherTextFormat);
    var authTagObj = {
      buffer: authTagBuffer,
      string: authTagString
    };
    var payloadFunc = deriveKey && generateEncryptPayloadWithKDF || generateEncryptPayloadWithoutKDF;
    var payloadObj = payloadFunc(options, cipherTextObj, authTagObj, ivObj, saltObj);
    var {
      string: payloadString
    } = payloadObj;
    var encryptedData = {
      salt: saltString,
      iv: ivString,
      authTag: authTagString,
      cipherText: cipherTextString,
      payload: payloadString
    };
    return encryptedData;
  } catch (e) {
    throw new _CryptoError.default(e, source);
  }
}

function decrypt(algorithm) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var source = "".concat(algorithm, "::decrypt");
  var {
    iv = '',
    salt = '',
    authTag = '',
    cipherText = ''
  } = params;

  var options = _objectSpread({}, DEFAULT_OPTIONS, {}, _options);

  var {
    ivFormat,
    saltFormat,
    cipherTextFormat,
    plainTextFormat,
    deriveKey
  } = options;
  validateDecryptOptions(source, params, options);

  try {
    var payloadPartsFunc = deriveKey && getPayloadPartsWithKDF || getPayloadPartsWithoutKDF;
    var payloadPartsObj = payloadPartsFunc(source, params, options);
    var {
      cipherTextBuffer,
      ivBuffer,
      saltBuffer,
      authTagBuffer
    } = payloadPartsObj;
    saltBuffer = saltBuffer || Buffer.from(salt, saltFormat);
    ivBuffer = ivBuffer || Buffer.from(iv, ivFormat);
    cipherTextBuffer = cipherTextBuffer || Buffer.from(cipherText, cipherTextFormat);
    authTagBuffer = authTagBuffer || Buffer.from(authTag, cipherTextFormat);

    var _params = _objectSpread({}, params, {
      saltBuffer
    });

    var keyObj = getKey(algorithm, _params, options);
    var {
      buffer: keyBuffer
    } = keyObj;

    var decryptor = _crypto.default.createDecipheriv(algorithm, keyBuffer, ivBuffer);

    decryptor.setAuthTag(authTagBuffer);
    var plainTextBuffer = Buffer.concat([decryptor.update(cipherTextBuffer), decryptor.final()]);
    var plainTextString = plainTextBuffer.toString(plainTextFormat);
    var decryptedData = {
      data: plainTextString
    };
    return decryptedData;
  } catch (e) {
    throw new _CryptoError.default(e, source);
  }
}

function validateEncryptOptions(source, params, options) {
  var {
    key,
    data,
    masterKey
  } = params;
  var {
    deriveKey
  } = options;

  if (typeof data !== 'string' || !data) {
    throw new _CryptoError.default(null, source, 'Provided \'data\' must be a non-empty string');
  }

  if (!deriveKey && (typeof key !== 'string' || !key)) {
    throw new _CryptoError.default(null, source, 'Provided \'key\' must be a non-empty string for non-derived keys');
  }

  if (deriveKey && (typeof masterKey !== 'string' || !masterKey)) {
    throw new _CryptoError.default(null, source, 'Provided \'masterKey\' must be a non-empty string for derived keys');
  }
}

function validateDecryptOptions(source, params, options) {
  var {
    key,
    payload,
    masterKey,
    cipherText,
    iv
  } = params;
  var {
    deriveKey
  } = options;

  if ((typeof payload !== 'string' || !payload) && (typeof cipherText !== 'string' || !cipherText)) {
    throw new _CryptoError.default(null, source, 'Provided \'payload\' or \'cipherText\' must be a non-empty string');
  }

  if (!deriveKey && (typeof key !== 'string' || !key)) {
    throw new _CryptoError.default(null, source, 'Provided \'key\' must be a non-empty string for non-derived keys');
  }

  if (deriveKey && (typeof masterKey !== 'string' || !masterKey)) {
    throw new _CryptoError.default(null, source, 'Provided \'masterKey\' must be a non-empty string for derived keys');
  }

  if (typeof cipherText === 'string' && cipherText && (typeof iv !== 'string' || !iv)) {
    throw new _CryptoError.default(null, source, 'Provided \'iv\' must be a non-empty string');
  }
}

function getEncryptIV(params, options) {
  var {
    iv
  } = params;
  var {
    ivFormat,
    ivLength
  } = options;

  var buffer = iv && Buffer.from(iv, ivFormat) || _crypto.default.randomBytes(ivLength);

  var string = iv || buffer.toString(ivFormat);
  return {
    buffer,
    string
  };
}

function getSalt(params, options) {
  var {
    salt,
    saltBuffer
  } = params;
  var {
    saltFormat,
    saltLength
  } = options;

  var buffer = saltBuffer || salt && Buffer.from(salt, saltFormat) || _crypto.default.randomBytes(saltLength);

  var string = salt || buffer.toString(saltFormat);
  return {
    buffer,
    string
  };
}

function getKey(algorithm, params, options) {
  var {
    key,
    masterKey
  } = params;
  var {
    deriveKey,
    keyFormat
  } = options;
  var saltObj = deriveKey && getSalt(params, options) || undefined;
  var {
    buffer: saltBuffer
  } = saltObj || {};
  var keyLength = KEY_LENGTH_MAP[algorithm];
  var buffer = deriveKey ? _AesUtils.default.deriveKey(masterKey, saltBuffer, keyLength, options) : Buffer.from(key, keyFormat);
  return {
    buffer,
    string: deriveKey && masterKey || key,
    saltObj
  };
}

function generateEncryptPayloadWithKDF(options, cipherTextObj, authTagObj, ivObj, saltObj) {
  var {
    dataSeparator,
    cipherTextFormat
  } = options;
  var {
    buffer: cipherTextBuffer,
    string: cipherTextString
  } = cipherTextObj;
  var {
    buffer: authTagBuffer,
    string: authTagString
  } = authTagObj;
  var {
    buffer: ivBuffer,
    string: ivString
  } = ivObj;
  var {
    buffer: saltBuffer,
    string: saltString
  } = saltObj;
  var payloadBuffer = Buffer.concat([saltBuffer, ivBuffer, authTagBuffer, cipherTextBuffer]);
  var payloadString = dataSeparator ? [saltString, ivString, authTagString, cipherTextString].join(dataSeparator) : payloadBuffer.toString(cipherTextFormat);
  return {
    buffer: payloadBuffer,
    string: payloadString
  };
}

function generateEncryptPayloadWithoutKDF(options, cipherTextObj, authTagObj, ivObj) {
  var {
    dataSeparator,
    cipherTextFormat
  } = options;
  var {
    buffer: cipherTextBuffer,
    string: cipherTextString
  } = cipherTextObj;
  var {
    buffer: authTagBuffer,
    string: authTagString
  } = authTagObj;
  var {
    buffer: ivBuffer,
    string: ivString
  } = ivObj;
  var payloadBuffer = Buffer.concat([ivBuffer, authTagBuffer, cipherTextBuffer]);
  var payloadString = dataSeparator ? [ivString, authTagString, cipherTextString].join(dataSeparator) : payloadBuffer.toString(cipherTextFormat);
  return {
    buffer: payloadBuffer,
    string: payloadString
  };
}

function getPayloadPartsWithKDF(source, params, options) {
  var {
    payload
  } = params;
  var {
    dataSeparator,
    saltFormat,
    ivFormat,
    cipherTextFormat,
    saltLength,
    ivLength,
    authTagLength
  } = options;
  var saltBuffer;
  var ivBuffer;
  var authTagBuffer;
  var cipherTextBuffer;

  if (dataSeparator) {
    var [saltString, ivString, authTagString, cipherTextString] = payload.split(dataSeparator);

    if (!saltString || !ivString || !authTagString || !cipherTextString) {
      throw new _CryptoError.default(null, source, 'Invalid \'payload\' for decrpytion');
    }

    saltBuffer = Buffer.from(saltString, saltFormat);
    ivBuffer = Buffer.from(ivString, ivFormat);
    authTagBuffer = Buffer.from(authTagString, cipherTextFormat);
    cipherTextBuffer = Buffer.from(cipherTextString, cipherTextFormat);
  } else {
    var payloadBuffer = Buffer.from(payload, cipherTextFormat);
    var saltBufferLimit = saltLength;
    var ivBufferLimit = saltLength + ivLength;
    var authTagBufferLimit = saltLength + ivLength + authTagLength;
    saltBuffer = payloadBuffer.slice(0, saltBufferLimit);
    ivBuffer = payloadBuffer.slice(saltBufferLimit, ivBufferLimit);
    authTagBuffer = payloadBuffer.slice(ivBufferLimit, authTagBufferLimit);
    cipherTextBuffer = payloadBuffer.slice(authTagBufferLimit);
  }

  return {
    saltBuffer,
    ivBuffer,
    authTagBuffer,
    cipherTextBuffer
  };
}

function getPayloadPartsWithoutKDF(source, params, options) {
  var {
    payload
  } = params;
  var {
    dataSeparator,
    ivFormat,
    cipherTextFormat,
    ivLength,
    authTagLength
  } = options;
  var ivBuffer;
  var authTagBuffer;
  var cipherTextBuffer;

  if (dataSeparator) {
    var [ivString, authTagString, cipherTextString] = payload.split(dataSeparator);

    if (!ivString || !authTagString || !cipherTextString) {
      throw new _CryptoError.default(null, source, 'Invalid \'payload\' for decrpytion');
    }

    ivBuffer = Buffer.from(ivString, ivFormat);
    authTagBuffer = Buffer.from(authTagString, cipherTextFormat);
    cipherTextBuffer = Buffer.from(cipherTextString, cipherTextFormat);
  } else {
    var payloadBuffer = Buffer.from(payload, cipherTextFormat);
    var ivBufferLimit = ivLength;
    var authTagBufferLimit = ivLength + authTagLength;
    ivBuffer = payloadBuffer.slice(0, ivBufferLimit);
    authTagBuffer = payloadBuffer.slice(ivBufferLimit, authTagBufferLimit);
    cipherTextBuffer = payloadBuffer.slice(authTagBufferLimit);
  }

  return {
    ivBuffer,
    authTagBuffer,
    cipherTextBuffer
  };
}