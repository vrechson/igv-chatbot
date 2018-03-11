'use strict'

const Error = require('./error')

class PersonNotFoundError extends Error {}

module.exports = PersonNotFoundError
