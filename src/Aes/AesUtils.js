'use strict'

import crypto from 'crypto'
import randomstring from 'randomstring'

export const AesUtils = {
  generateKey,
  extractKeyFromToken
}

function generateKey (length = 16) {
  return randomstring.generate(length)
}

// TODO: Implement PBKDF2
function extractKeyFromToken (token = '') {
  const [,, checksum] = token.split('.')
  const checksumLength = checksum.length
  const eKey1 = checksum.substring(0, 16)
  const eKey2 = checksum.substring(checksumLength-16)
  const encryptionKey = [eKey1, eKey2].join('')
  return encryptionKey
}
