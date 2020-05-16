'use strict'

import openpgp, { key, message } from 'openpgp'
import PgpUtils from './PgpUtils'
import CryptoError from '../CryptoError'

const ALGORITHM = 'PGP'
const Pgp = {
  encrypt,
  decrypt
}

const DEFAULT_OPTIONS = {}

export default Pgp

async function encrypt (params = {}, options = DEFAULT_OPTIONS) {
  const source = `${ALGORITHM}::encrypt`
  const { data = {}, publicKeyArmored = '', passphrase = '', userIds = [] } = params
  const dataString = JSON.stringify(data)

  if (typeof publicKeyArmored !== 'string' || !publicKeyArmored) {
    throw new CryptoError(null, source, 'Provided \'publicKeyArmored\' must be a non-empty string')
  }

  if (typeof passphrase !== 'string' || !passphrase) {
    throw new CryptoError(null, source, 'Provided \'passphrase\' must be a non-empty string')
  }

  try {
    const keyGenOpts = { userIds, passphrase }
    const newKeys = await PgpUtils.generateKeys(keyGenOpts)
    const { privateKeyArmored } = newKeys
    const { keys: [privateKey] } = await key.readArmored(privateKeyArmored)
    await privateKey.decrypt(passphrase)

    const msg = message.fromText(dataString)
    const publicKeys = (await key.readArmored(publicKeyArmored)).keys
    const encryptionOpts = {
      message: msg,
      publicKeys,
      privateKeys: [privateKey]
    }

    const { data: encryptedData } = await openpgp.encrypt(encryptionOpts)

    return {
      payload: encryptedData,
      publicKeyArmored: newKeys.publicKeyArmored
    }
  } catch (e) { throw new CryptoError(e, source) }
}

async function decrypt (params = {}, options = DEFAULT_OPTIONS) {
  const source = `${ALGORITHM}::decrypt`
  const { data = {}, privateKeyArmored = '', passphrase = '' } = params

  if (typeof privateKeyArmored !== 'string' || !privateKeyArmored) {
    throw new CryptoError(null, source, 'Provided \'privateKeyArmored\' must be a non-empty string')
  }

  if (typeof passphrase !== 'string' || !passphrase) {
    throw new CryptoError(null, source, 'Provided \'passphrase\' must be a non-empty string')
  }

  const { payload, publicKeyArmored } = data

  if (!payload || !publicKeyArmored) { return {} }

  try {
    const { keys: [privateKey] } = await key.readArmored(privateKeyArmored)
    await privateKey.decrypt(passphrase)

    const msg = await message.readArmored(payload)
    const publicKeys = (await key.readArmored(publicKeyArmored)).keys
    const decryptionOpts = {
      message: msg,
      publicKeys,
      privateKeys: [privateKey]
    }

    const { data: decryptedData } = await openpgp.decrypt(decryptionOpts)
    const jsonData = JSON.parse(decryptedData)
    return jsonData
  } catch (e) { throw new CryptoError(e, source) }
}
