'use strict'

import openpgp, { key, message } from 'openpgp'
import PgpUtils from './PgpUtils'

const Pgp = {
  encrypt,
  decrypt
}

const DEFAULT_OPTIONS = {}

export default Pgp

async function encrypt (params = {}, options = DEFAULT_OPTIONS) {
  const { data = {}, publicKeyArmored = '', passphrase = '', userIds = [] } = params
  const dataString = JSON.stringify(data)

  if (typeof publicKeyArmored !== 'string' || !publicKeyArmored) {
    throw new Error('Provided "publicKeyArmored" must be a non-empty string')
  }

  if (typeof passphrase !== 'string' || !passphrase) {
    throw new Error('Provided "passphrase" must be a non-empty string')
  }

  const keyGenOpts = { userIds, passphrase }
  const newKeys = await PgpUtils.generateKeys(keyGenOpts)
  let { privateKeyArmored } = newKeys
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
}

async function decrypt (params = {}, options = DEFAULT_OPTIONS) {
  const { data = {}, privateKeyArmored = '', passphrase = '' } = params

  if (typeof privateKeyArmored !== 'string' || !privateKeyArmored) {
    throw new Error('Provided "privateKeyArmored" must be a non-empty string')
  }

  if (typeof passphrase !== 'string' || !passphrase) {
    throw new Error('Provided "passphrase" must be a non-empty string')
  }

  const { payload, publicKeyArmored } = data

  if (!payload || !publicKeyArmored) { return data }

  const { keys: [privateKey] } = await key.readArmored(privateKeyArmored)
  await privateKey.decrypt(passphrase)

  const msg = await message.readArmored(payload)
  const publicKeys = (await key.readArmored(publicKeyArmored)).keys
  const decryptionOpts = {
    message: msg,
    publicKeys,
    privateKeys: [privateKey],
  }

  const { data: decryptedData } = await openpgp.decrypt(decryptionOpts)
  const jsonData = JSON.parse(decryptedData)
  return jsonData
}
