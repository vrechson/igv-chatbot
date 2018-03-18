'use strict'

const axios = require('axios')
const Error = require('./errors/error')

class TokenService {
  constructor (config) {
    this.$http = axios.create({
      baseUrl: config.EXPA_API_URL
    })
  }

  async getNew (email, password) {
    const response = await this.$http.post('/users/sign_in', {
      'user[email]': email,
      'user[password]': password,
      commit: 'Log in'
    })
  }
}

module.exports = TokenService
module.exports.Error = Error
