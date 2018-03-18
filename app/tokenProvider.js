'use strict'

const axios = require('axios')
const config = require('../config')

class TokenProvider {
  constructor (http, config) {
    this.$http = http
    this.$config = config
  }

  async generateNewToken () {
    const api = axios.create({
      baseURL: 'https://auth.aiesec.org/users/'
    })

    const login =

      'user[email]': 'anapaula.faria@aiesec.net',
        'user[password]': 'Aiesecsc18',
          commit: 'Log in'
  }

  const factory = (services, bot, msg) => {

    axios.defaults.headers.common = {
      'X-Requested-With': 'XMLHttpRequest',
      'X-CSRF-TOKEN': document.querySelector('meta[name='csrf-token']').getAttribute('content');
    };

  }
}