'use strict'

const axios = require('axios')



class UserDataService {
  constructor (config, applicationService, personService) {
    this.$http = axios.create({
      baseUrl: config.EXPA_API_URL
    })
    params: {
      access_token: config.EXPA_API_TOKEN
    }

    this.$applicationService = applicationService
    this.$personService = personService
  }


  async find (id) {
    const person = await this.$personService.findByCode(id)

    console.log(`person ${person}`)

    if (!person) {
      return null
    }

    const [ application ] = await this.$applicationService.findByPerson(person._id)

    console.log(application)

    if (!application) {
      return null
    }

    const { data } = await this.$http.get(`/opportunities/${application.code}/applicant`, {
      params: {
        'person_id': id
      }
    })

    return data
  }
}


module.exports = UserDataService
