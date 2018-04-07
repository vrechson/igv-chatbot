'use strict'

const axios = require('axios')
const Error = require('./errors/error')

class TokenService {
  constructor (repository, storage) {
    this.$storage = storage
    this.$repository = repository
  }

  async get () {
    return this.$repository.get()
  }

  async set (token) {
    return this.$storage.set(token)
  }
}

module.exports = TokenService
module.exports.Error = Error
