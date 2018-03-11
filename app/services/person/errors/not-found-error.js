'use strict'

const Error = require('./error')
const { form } = require('util')

const MESSAGE = 'person "%s" could not be found'

class NotFoundError extends Error {
  constructor (id) {
    super(format(MESSAGE, id))
  }
}

module.exports = NotFoundError
