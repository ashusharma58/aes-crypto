'use strict'

import openpgp from 'openpgp'

const DEFAULT_PASSPHRASE = 'Batman'

const PgpUtils = {
  generateKeys
}

export default PgpUtils

async function generateKeys (params) {
  const { userIds = [], numBits = 2048, passphrase = DEFAULT_PASSPHRASE } = params

  if (!(userIds instanceof Array) || !userIds.length) {
    throw new Error('Provided "userIds" must be a non-empty Array')
  }

  const options = { userIds, numBits, passphrase }

  const keys = await openpgp.generateKey(options)
  return keys
}
