'use strict'

import { box, randomBytes } from 'tweetnacl'
import { encodeBase64, decodeBase64 } from 'tweetnacl-util'
import CryptoError from '../CryptoError'

const ENTITY = 'NaCl-Utils'

export const NaClUtils = {
  generateKeyPair,
  generateKey,
  generateNonce
}

function generateKeyPair () {
  try {
    const keyPair = box.keyPair()
    const { publicKey, secretKey } = keyPair
    const publicKeyString = encodeBase64(publicKey)
    const secretKeyString = encodeBase64(secretKey)
    return {
      publicKey: publicKeyString,
      secretKey: secretKeyString
    }
  } catch (e) { throw new CryptoError(ENTITY, 'Error Generating Key Pair', e) }
}

function generateKey (publicKeyString, secretKeyString) {
  try {
    const publicKey = decodeBase64(publicKeyString)
    const secretKey = decodeBase64(secretKeyString)
    return box.before(publicKey, secretKey)
  } catch (e) { throw new CryptoError(ENTITY, 'Error Generating Key', e) }
}

function generateNonce () {
  try {
    return randomBytes(box.nonceLength)
  } catch (e) { throw new CryptoError(ENTITY, 'Error Generating Nonce', e) }
}
