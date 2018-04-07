'use strict'

const Error = require('./error')
const { format } = require('util')

const MESSAGE = 'parameter %s is not valid'

class InvalidParameterError extends Error {
  constructor (parameter) {
    super(format(MESSAGE, parameter))
  }
}

module.exports = InvalidParameterError
