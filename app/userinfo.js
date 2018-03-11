'use strict'

const config = require('../config')
const axios = require('axios')

class userData {
  Id: {
    type: Number,
    require: true
  }
  Name: {
    type: String,
    require: true
  },
  Email: {
    type: String,
    require: true
  },
  Phone: {
    type: Number,
    require: true
  },
  Country: {
    type: String,
    require: true
  },
  Home_LC: {
    type: String,
    require: true
  },
  Ep_M: {
    type: String,
    require: false
  }
}

class userInfo {
  constructor (http, config, services) {
    this.$http = http
    this.$config = config
    this.$services = services
  }

  async start (personId) {

    const { data } = await this.$http.get('/applications', {
      params: {
        'person_id': personId,
      }
    })

  }
}
