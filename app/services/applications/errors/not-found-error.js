const Error = require('./error')

const { format } = require('util')

const MESSAGE = 'application "%s" not found'

class NotFoundError extends Error {
  constructor (id) {
    super(format(MESSAGE, id))
  }
}

module.exports = NotFoundError
