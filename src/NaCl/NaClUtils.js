'use strict'

import { box, randomBytes } from 'tweetnacl'
import { encodeBase64, decodeBase64 } from 'tweetnacl-util'

export const NaClUtils = {
  generateKeyPair,
  generateKey,
  generateNonce
}

function generateKeyPair () {
  const keyPair = box.keyPair()
  const { publicKey, secretKey } = keyPair
  const publicKeyString = encodeBase64(publicKey)
  const secretKeyString = encodeBase64(secretKey)
  return {
    publicKey: publicKeyString,
    secretKey: secretKeyString
  }
}

function generateKey (publicKeyString, secretKeyString) {
  const publicKey = decodeBase64(publicKeyString)
  const secretKey = decodeBase64(secretKeyString)
  return box.before(publicKey, secretKey)
}

function generateNonce () {
  return randomBytes(box.nonceLength)
}
