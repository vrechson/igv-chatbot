'use strict'

const axios = require('axios')

class UserDataService {
  constructor (config, applicationService, personService, tokenService) {
    this.$http = axios.create({
      baseURL: config.EXPA_API_URL
    })

    this.$tokenService = tokenService
    this.$personService = personService
    this.$applicationService = applicationService
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
        'person_id': id,
        access_token: await this.$tokenService.get().then(({ token }) => token)
      }
    })

    return applicant
  }
}


module.exports = UserDataService
