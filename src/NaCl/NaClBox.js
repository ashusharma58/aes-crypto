'use strict'

import { box } from 'tweetnacl'
import { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util'
import { NaClUtils } from './NaClUtils'
import CryptoError from '../CryptoError'

const ALGORITHM = 'NaCl-Box'
export const NaClBox = {
  encrypt,
  decrypt
}

function encrypt (publicKey, secretKey, data) {
  const key = NaClUtils.generateKey(publicKey, secretKey)
  const nonce = NaClUtils.generateNonce()

  try {
    const dataString = JSON.stringify(data)
    const dataUint8 = decodeUTF8(dataString)
    const encryptedData = box.after(dataUint8, nonce, key)

    const fullMessage = new Uint8Array(nonce.length + encryptedData.length)
    fullMessage.set(nonce)
    fullMessage.set(encryptedData, nonce.length)

    const base64FullMessage = encodeBase64(fullMessage)
    return base64FullMessage
  } catch (e) { throw new CryptoError(ALGORITHM, '', e) }
}

function decrypt (publicKey, secretKey, data) {
  const key = NaClUtils.generateKey(publicKey, secretKey)

  try {
    const dataWithNonceAsUint8Array = decodeBase64(data)
    const nonce = dataWithNonceAsUint8Array.slice(0, box.nonceLength)
    const encryptedData = dataWithNonceAsUint8Array.slice(box.nonceLength, data.length)
    const decryptedData = box.open.after(encryptedData, nonce, key)

    if (decryptedData === null) {
      throw new CryptoError(ALGORITHM, 'Error Decrypting Data')
    }

    const base64DecryptedData = encodeUTF8(decryptedData)

    try {
      const jsonData = JSON.parse(base64DecryptedData)
      return jsonData
    } catch (e) { return base64DecryptedData }
  } catch (e) { throw new CryptoError(ALGORITHM, '', e) }
}
