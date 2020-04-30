'use strict'

import openpgp from 'openpgp'
import CryptoError from '../CryptoError'

const ENTITY = 'PGP-Utils'
const DEFAULT_PASSPHRASE = 'Batman'

const PgpUtils = {
  generateKeys
}

export default PgpUtils

async function generateKeys (params) {
  const { userIds = [], numBits = 2048, passphrase = DEFAULT_PASSPHRASE } = params

  if (!(userIds instanceof Array) || !userIds.length) {
    throw new CryptoError(ENTITY, `Provided 'userIds' must be a non-empty Array`)
  }

  const options = { userIds, numBits, passphrase }

  try {
    const keys = await openpgp.generateKey(options)
    return keys
  } catch (e) { throw new CryptoError(ENTITY, 'Error Generating Keys', e) }
}
