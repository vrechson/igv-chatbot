'use strict'

const axios = require('axios')
const config = require('../config')

class userData {
  constructor (id, /*name, email, phone, country, homeLC, epManager,*/ http, config, services) {
    this.$id = id /*
    this.$name = name
    this.$email = email
    this.$phone = phone
    this.$country = country
    this.$homeLC = homeLC
    this.$epManager = epManager */
    this.$http = http
    this.$config = config
    this.$services = services
  }

  async start () {
    const userInfo = []
    const { data } = await this.$http.get('/applications', {
      params: {
        'person_id': this.$id,
      }
    })

    userInfo.push(...data.data)

    const personName = userInfo.person.name
    const personEmail = userInfo.person.phone
    const personCountry = userInfo.person.homeLC
    const personLC = userInfo.person.homeLC
    const personEPM = userInfo.person.epManager

    // const personPromises =
  }
}

const factory = (id, services) => {
  const http = axios.create({
    baseURL: config.EXPA_API_URL,
    params: {
      access_token: config.EXPA_API_TOKEN
    }
  })

  return new userData(id, http, config, services)
}
