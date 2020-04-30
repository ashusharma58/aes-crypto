'use strict'

import crypto from 'crypto'
import CryptoError from '../CryptoError'

const ALGORITHMS = ['aes-128-cbc', 'aes-256-cbc']

const AesCBC = {
  ALGORITHMS,
  encrypt,
  decrypt
}

export default AesCBC

const DEFAULT_OPTIONS = {
  outputFormat: 'hex',
  uriEncode: false
}

function encrypt (algorithm, params = {}, options = DEFAULT_OPTIONS) {
  const { key = '', data = '' } = params
  const {
    outputFormat = DEFAULT_OPTIONS.outputFormat,
    uriEncode = DEFAULT_OPTIONS.uriEncode
  } = options

  if (typeof key !== 'string' || !key) {
    throw new CryptoError(algorithm, `Provided 'key' must be a non-empty string`)
  }

  if (typeof data !== 'string' || !data) {
    throw new CryptoError(algorithm, `Provided 'data' must be a non-empty string`)
  }

  try {
    const ivBuffer = crypto.randomBytes(16)
    const ivString = ivBuffer.toString(outputFormat)

    const encryptor = crypto.createCipheriv(algorithm, key, ivBuffer)
    let cipherText = encryptor.update(data, 'utf8', outputFormat)
    cipherText += encryptor.final(outputFormat)
    cipherText = [ivString, cipherText].join('.')

    if (uriEncode) {
      cipherText = encodeURIComponent(cipherText)
    }
    return cipherText
  } catch (e) { throw new CryptoError(algorithm, '', e) }
}

function decrypt (algorithm, params = {}, options = DEFAULT_OPTIONS) {
  const { key = '', data = '' } = params
  const {
    outputFormat = DEFAULT_OPTIONS.outputFormat,
    uriEncode = DEFAULT_OPTIONS.uriEncode
  } = options
  let encryptedData = data

  if (typeof key !== 'string' || !key) {
    throw new CryptoError(algorithm, `Provided 'key' must be a non-empty string`)
  }

  if (typeof data !== 'string' || !data) {
    throw new CryptoError(algorithm, `Provided 'data' must be a non-empty string`)
  }

  try {
    if (uriEncode) {
      encryptedData = decodeURIComponent(data)
    }

    encryptedData = encryptedData.split('.')

    if (encryptedData.length !== 2) {
      throw new CryptoError(algorithm, 'Invalid Encrypted Data')
    }

    const [iv, cipherText] = encryptedData
    const ivBuffer = Buffer.from(iv, outputFormat)
    const keyBuffer = Buffer.from(key)
    const decryptor = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer)
    let decryptedText = decryptor.update(cipherText, outputFormat, 'utf8')
    decryptedText += decryptor.final('utf8')
    return decryptedText
  } catch (e) { throw new CryptoError(algorithm, '', e) }
}
