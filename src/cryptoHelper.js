'use strict'

import crypto from 'crypto'
import randomstring from 'randomstring'

const cryptoHelper = {
  randomBytes,
  randomString
}

export default cryptoHelper

function randomBytes (length = 16, format) {
  let random = crypto.randomBytes(length)
  random = (format && random.toString(format)) || random
  return random
}

function randomString (length = 16) {
  return randomstring.generate(length)
}
