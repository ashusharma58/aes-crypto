'use strict'

import http from 'http'

export class ResponseBody {
  constructor (statusCode, message, data) {
    this.statusCode = statusCode
    this.message = message || http.STATUS_CODES[statusCode]
    this.data = data
  }
}
