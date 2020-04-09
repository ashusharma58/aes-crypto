'use strict'

import crypto from 'crypto'
import randomstring from 'randomstring'

export const AesUtils = {
  generateKey,
  extractKeyFromToken,
  generatePublicKey,
  generatePrivateKey
}

function generateKey (length = 16) {
  return randomstring.generate(length)
}

function extractKeyFromToken (token = '') {
  const [,, checksum] = token.split('.')
  const checksumLength = checksum.length
  const eKey1 = checksum.substring(0, 16)
  const eKey2 = checksum.substring(checksumLength-16)
  const encryptionKey = [eKey1, eKey2].join('')
  return encryptionKey
}

function generatePublicKey (outputFormat = 'base64') {
  const ecdh = crypto.createECDH('secp256k1')
  const publicKey = ecdh.generateKeys(outputFormat)
  return { ecdh, publicKey }
}

function generatePrivateKey (ecdh, publicKey, outputFormat = 'base64') {
  const key = ecdh.computeSecret(publicKey, outputFormat)
  return key.toString(outputFormat)
}
