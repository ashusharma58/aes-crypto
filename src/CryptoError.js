'use strict'

import ResponseBody from './ResponseBody'

const STATUS_CODE = 500

export default class CryptoError extends Error {
  constructor (entity, message, error) {
    super(message)
    Error.captureStackTrace(this, CryptoError)

    this.name = `CryptoError(${entity.toUpperCase()})`
    this.statusCode = STATUS_CODE
    this.message = message || error.message
    this.error = (error.constructor.name !== 'CryptoError' && error) || undefined
  }

  getResponseBody () {
    const { statusCode, message, error } = this
    return new ResponseBody(statusCode, message, undefined, error)
  }
}
