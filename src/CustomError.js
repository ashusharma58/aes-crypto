'use strict'

export class CustomError extends Error {
  constructor (message, ...params) {
    super(message)
    Error.captureStackTrace(this, CustomError)

    const [name] = params
    this.name = name || 'CustomError'
    this.message = message
    this.errorMessage = message
  }
}
