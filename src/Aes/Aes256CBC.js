'use strict'

import crypto from 'crypto'
import { CryptoError } from '../CryptoError'

const ALGORITHM = 'aes-256-cbc'
export const Aes256CBC = {
  encrypt,
  decrypt
}

const DEFAULT_OPTIONS = {
  outputFormat: 'hex',
  uriEncode: false
}

function encrypt (params = {}, options = DEFAULT_OPTIONS) {
  try {
    const { key = '', data = '' } = params
    const {
      outputFormat = DEFAULT_OPTIONS.outputFormat,
      uriEncode = DEFAULT_OPTIONS.uriEncode
    } = options

    if (typeof key !== 'string' || !key) {
      throw new Error('Provided "key" must be a non-empty string')
    }

    if (typeof data !== 'string' || !data) {
      throw new Error('Provided "data" must be a non-empty string')
    }

    const ivBuffer = crypto.randomBytes(16)
    const ivString = ivBuffer.toString(outputFormat)

    const encryptor = crypto.createCipheriv(ALGORITHM, key, ivBuffer)
    let cipherText = encryptor.update(data, 'utf8', outputFormat)
    cipherText += encryptor.final(outputFormat)
    cipherText = [ivString, cipherText].join('.')

    if (uriEncode) {
      cipherText = encodeURIComponent(cipherText)
    }
    return cipherText
  } catch (e) { throw new CryptoError(e, ALGORITHM) }
}

function decrypt (params = {}, options = DEFAULT_OPTIONS) {
  try {
    const { key = '', data = '' } = params
    const {
      outputFormat = DEFAULT_OPTIONS.outputFormat,
      uriEncode = DEFAULT_OPTIONS.uriEncode
    } = options
    let encryptedData = data

    if (typeof key !== 'string' || !key) {
      throw new Error('Provided "key" must be a non-empty string')
    }

    if (typeof data !== 'string' || !data) {
      throw new Error('Provided "data" must be a non-empty string')
    }

    if (uriEncode) {
      encryptedData = decodeURIComponent(data)
    }

    encryptedData = encryptedData.split('.')

    if (encryptedData.length !== 2) {
      throw new Error('Invalid Encrypted Data')
    }

    const [iv, cipherText] = encryptedData
    const ivBuffer = Buffer.from(iv, outputFormat)
    const keyBuffer = Buffer.from(key)
    const decryptor = crypto.createDecipheriv(ALGORITHM, keyBuffer, ivBuffer)
    let decryptedText = decryptor.update(cipherText, outputFormat, 'utf8')
    decryptedText += decryptor.final('utf8')
    return decryptedText
  } catch (e) { throw new CryptoError(e, ALGORITHM) }
}
