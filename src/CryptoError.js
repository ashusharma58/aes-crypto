'use strict'

import http from 'http'
import { CustomError } from './CustomError'

const ERROR_NAME = 'CryptoError'

export class CryptoError extends CustomError {
  constructor (error, ...params) {
    const { message, statusCode = 500 } = error
    const [algorithm = ''] = params

    super(message, ERROR_NAME)

    this.algorithm = algorithm
    this.statusCode = statusCode
    this.status = http.STATUS_CODES[statusCode]
  }
}
