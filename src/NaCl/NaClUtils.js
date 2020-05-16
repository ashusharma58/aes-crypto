'use strict'

import { box, randomBytes } from 'tweetnacl'
import { encodeBase64, decodeBase64 } from 'tweetnacl-util'
import CryptoError from '../CryptoError'

const SOURCE = 'NaCl::Utils'

const NaClUtils = {
  generateKeyPair,
  generateKey,
  generateNonce
}

export default NaClUtils

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
  } catch (e) { throw new CryptoError(e, SOURCE, 'Error Generating Key Pair') }
}

function generateKey (publicKeyString, secretKeyString) {
  try {
    const publicKey = decodeBase64(publicKeyString)
    const secretKey = decodeBase64(secretKeyString)
    return box.before(publicKey, secretKey)
  } catch (e) { throw new CryptoError(e, SOURCE, 'Error Generating Key') }
}

function generateNonce () {
  try {
    return randomBytes(box.nonceLength)
  } catch (e) { throw new CryptoError(e, SOURCE, 'Error Generating Nonce') }
}
