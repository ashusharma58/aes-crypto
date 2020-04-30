'use strict'

import crypto from 'crypto'
import CryptoError from '../CryptoError'

const ALGORITHMS = ['aes-128-gcm', 'aes-256-gcm']
const AesGCM = {
  ALGORITHMS,
  encrypt,
  decrypt
}

export default AesGCM

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
    throw new CryptoError(ALGORITHM, `Provided 'key' must be a non-empty string`)
  }

  if (typeof data !== 'string' || !data) {
    throw new CryptoError(ALGORITHM, `Provided 'data' must be a non-empty string`)
  }

  try {
    const ivBuffer = crypto.randomBytes(16)
    const ivString = ivBuffer.toString(outputFormat)
    const keyBuffer = Buffer.from(key)
    const encryptor = crypto.createCipheriv(algorithm, keyBuffer, ivBuffer)
    let cipherText = encryptor.update(data, 'utf8', outputFormat)
    cipherText += encryptor.final(outputFormat)
    const authTagBuffer = encryptor.getAuthTag()
    const authTag = authTagBuffer.toString(outputFormat)
    let finalData = [ivString, cipherText, authTag].join('.')

    if (uriEncode) {
      finalData = encodeURIComponent(finalData)
    }

    return finalData
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
      encryptedData = decodeURIComponent(encryptedData)
    }

    encryptedData = encryptedData.split('.')

    if (encryptedData.length !== 3) {
      throw new CryptoError(algorithm, 'Invalid Encrypted Data')
    }

    const [iv, cipherText, authTag] = encryptedData
    const ivBuffer = Buffer.from(iv, outputFormat)
    const bufferAuth = Buffer.from(authTag, outputFormat)
    const keyBuffer = Buffer.from(key)
    const decryptor = crypto.createDecipheriv(algorithm, keyBuffer, ivBuffer)
    decryptor.setAuthTag(bufferAuth)
    let decryptedText = decryptor.update(cipherText, outputFormat, 'utf8')
    decryptedText += decryptor.final('utf8')
    return decryptedText
  } catch (e) { throw new CryptoError(algorithm, '', e) }
}
