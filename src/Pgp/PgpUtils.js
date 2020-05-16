'use strict'

import openpgp from 'openpgp'
import CryptoError from '../CryptoError'

const SOURCE = 'PGP::Utils'
const DEFAULT_PASSPHRASE = 'Batman'

const PgpUtils = {
  generateKeys
}

export default PgpUtils

async function generateKeys (params) {
  const { userIds = [], numBits = 2048, passphrase = DEFAULT_PASSPHRASE } = params

  if (!(userIds instanceof Array) || !userIds.length) {
    throw new CryptoError(null, SOURCE, 'Provided \'userIds\' must be a non-empty Array to Generate Keys')
  }

  const options = { userIds, numBits, passphrase }

  try {
    const keys = await openpgp.generateKey(options)
    return keys
  } catch (e) { throw new CryptoError(e, SOURCE, 'Error Generating Keys') }
}
