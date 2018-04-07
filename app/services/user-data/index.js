'use strict'

const axios = require('axios')

class UserDataService {
  constructor (config, applicationService, personService) {
    this.$http = axios.create({
      baseURL: config.EXPA_API_URL,
      params: {
        access_token: config.EXPA_API_TOKEN
      }
    })

    this.$applicationService = applicationService
    this.$personService = personService
  }


  async find (id) {
    const person = await this.$personService.findByCode(id)

    if (!person) {
      return null
    }

    const [ application ] = await this.$applicationService.findByPerson(person._id)

    if (!application) {
      return null
    }

    const endpoint = `/opportunities/${application.opportunity._id}/applicant.json`

    const { data: applicant } = await this.$http.get(endpoint, {
      params: {
        'person_id': id
      }
    })

    return applicant
  }
}


module.exports = UserDataService
