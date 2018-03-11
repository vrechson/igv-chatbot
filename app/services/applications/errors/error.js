'use strict'

class BaseError extends Error {
  constructor (message, stack) {
    super(message)
    this.stack = stack
    this.name = this.constructor.name
  }
}

module.exports = BaseError
