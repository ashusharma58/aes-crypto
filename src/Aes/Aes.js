'use strict'

import { ALGORITHM } from './AES_MAP'
import { CryptoError } from '../CryptoError'

export const Aes = {
  encrypt,
  decrypt
}

function encrypt (algorithom, params, options) {
  try {
    if (typeof algorithom !== 'string' || !algorithom) {
      throw new TypeError('Provided "algorithom" must be a non-empty string')
    }

    const crypto = ALGORITHM[algorithom]
    if (!crypto) {
      throw new TypeError(`Unprocessable AES Algorithm: ${algorithom}`)
    }
    return crypto.encrypt(params, options)
  } catch (e) { throw new CryptoError(e) }
}

function decrypt (algorithom, params, options) {
  try {
    if (typeof algorithom !== 'string' || !algorithom) {
      throw new TypeError('Provided "algorithom" must be a non-empty string')
    }

    const crypto = ALGORITHM[algorithom]
    if (!crypto) {
      throw new TypeError(`Unprocessable AES Algorithm: ${algorithom}`)
    }
    return crypto.decrypt(params, options)
  } catch (e) { throw new CryptoError(e) }
}
