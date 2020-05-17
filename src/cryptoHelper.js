'use strict'

import crypto from 'crypto'
import randomstring from 'randomstring'
import CryptoError from './CryptoError'

const cryptoHelper = {
  randomBytes,
  randomString,
  generateKey
}

export default cryptoHelper

function randomBytes (length = 16, format) {
  let random = crypto.randomBytes(length)
  random = (format && random.toString(format)) || random
  return random
}

function randomString (length = 16) {
  return randomstring.generate(length)
}

function generateKey (params = {}, options = {}) {
  const source = 'cryptoHelper::generateKey'
  const { masterKey, saltBuffer, keyBufferLength = 32, keyFormat = 'hex' } = params
  const { kdf, kdfIterations = 50, kdfDigest = 'sha256' } = options
  let returnObj = {}
  let key

  if (kdf && !masterKey) {
    throw new CryptoError(null, source, `Missing 'masterKey' params for provided KDF '${kdf}'`)
  }

  switch (kdf) {
    case 'PBKDF2':
      const _saltBuffer = saltBuffer || randomBytes(16)
      key = crypto.pbkdf2Sync(masterKey, _saltBuffer, kdfIterations, keyBufferLength, kdfDigest)
      key = key.toString(keyFormat)
      returnObj = { saltBuffer: _saltBuffer, key }
      break

    default:
      key = randomBytes(keyBufferLength, keyFormat)
      returnObj = { key }
  }

  return returnObj
}
