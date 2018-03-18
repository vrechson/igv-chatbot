'use strict'

const Error = require('./error')
const { format } = require('util')

const MESSAGE = 'chat "%s" already exists'

class ExistingChatError extends Error {
  constructor (id) {
    super(format(MESSAGE, id))
  }
}

module.exports = ExistingChatError
