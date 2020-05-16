'use strict'

import { box } from 'tweetnacl'
import { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util'
import NaClUtils from './NaClUtils'
import CryptoError from '../CryptoError'

const ALGORITHM = 'NaClBox'
const NaClBox = {
  encrypt,
  decrypt
}

export default NaClBox

function encrypt (publicKey, secretKey, data) {
  const source = `${ALGORITHM}::encrypt`
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
    return { payload: base64FullMessage }
  } catch (e) { throw new CryptoError(e, source) }
}

function decrypt (publicKey, secretKey, data) {
  const source = `${ALGORITHM}::decrypt`
  const key = NaClUtils.generateKey(publicKey, secretKey)

  try {
    const dataWithNonceAsUint8Array = decodeBase64(data)
    const nonce = dataWithNonceAsUint8Array.slice(0, box.nonceLength)
    const encryptedData = dataWithNonceAsUint8Array.slice(box.nonceLength, data.length)
    const decryptedData = box.open.after(encryptedData, nonce, key)

    if (decryptedData === null) {
      throw new CryptoError(null, source, 'Error Decrypting Data')
    }

    const base64DecryptedData = encodeUTF8(decryptedData)

    try {
      const jsonData = JSON.parse(base64DecryptedData)
      return { payload: jsonData }
    } catch (e) { return { payload: base64DecryptedData } }
  } catch (e) { throw new CryptoError(e, source) }
}
