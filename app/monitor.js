'use strict'

const config = require('../config')
const axios = require('axios')

class Monitor {
  constructor (http, config, services) {
    this.$http = http
    this.$config = config
    this.$services = services
  }

  async start () {
    const applications = []
    let currentPage = 1
    let totalItems = 1

    while (applications.length < totalItems) {
      const { data } = await this.$http.get('/applications', {
        params: {
          'filters[status]': 'open',
          'filters[my]': 'opportunity',
          page: currentPage++
        }
      })

      totalItems = data.paging.total_items

      applications.push(...data.data)
    }

    const peopleSet = applications.reduce((set, application) => set.add(application.person.id), new Set())
    const personIds = Array.from(peopleSet.keys())

    const dbPeople = await this.$services.person.listIds()

    const newPeople = personIds.filter(id => !dbPeople.includes(id))

    console.log('creating', newPeople.length, 'new people')

    const personPromises = newPeople.map(personId => {
      return this.$services.person.create(personId)
    })

    await Promise.all(personPromises)

    const applicationsMap = applications.map((map, application) => map.set(application.id, application), new Map())
    const applicationIds = Array.from(applicationsMap.keys())

    const dbApplications = await this.$services.application.listIds()

    const newApplications = applicationIds.filter(id => !dbApplications.includes(id))

    console.log('creating', newApplications.length, 'new applications')

    const applicationPromises = newApplications.map(applicationId => {
      const application = applicationsMap.get(applicationId)
      return this.$services.application.create(application.person.id, applicationId)
    })

    await Promise.all(applicationPromises)

    setTimeout(this.start.bind(this), this.$config.EXPA_API_RECURENCE)
  }
}

const factory = (services) => {
  const http = axios.create({
    baseURL: config.EXPA_API_URL,
    params: {
      access_token: config.EXPA_API_TOKEN
    }
  })

  http.interceptors.request.use(request => {
    console.log(request)

    return request
  })

  return new Monitor(http, config, services)
}

module.exports = { factory }
