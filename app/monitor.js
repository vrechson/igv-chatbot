'use strict'

const axios = require('axios')
const userData = require('./userData')
const config = require('../config')

class Monitor {
  constructor (http, config, services, bot) {
    this.$http = http
    this.$config = config
    this.$services = services
    this.$bot = bot
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
    const personCodes = Array.from(peopleSet.keys())

    const dbPeople = await this.$services.person.listCodes()

    const newPeople = personCodes.filter(id => !dbPeople.includes(id))

    console.log('creating', newPeople.length, 'new people')

    const personPromises = newPeople.map(async personCode => {

      bot.sendMessage(msg.chat.id, 'New person applied!', {
        reply_markup: {
          inline_keyboard: [[{
              text: 'take it!',
              switch_inline_query: 'éoque'
          }]]
        }
      })

      return this.$services.person.create(personCode)
                 .catch(console.error)
    })

    const createdPeople = await Promise.all(personPromises)

    const createdPeopleMap = createdPeople.reduce((map, createdPerson) => {
      return map.set(createdPerson.code, createdPerson)
    }, new Map())

    const applicationsMap = applications.reduce((map, application) => map.set(application.id, application), new Map())
    const applicationCodes = Array.from(applicationsMap.keys())

    const dbApplications = await this.$services.application.listCodes()

    const newApplications = applicationCodes.filter(id => !dbApplications.includes(id))

    console.log('creating', newApplications.length, 'new applications')

    const applicationPromises = newApplications.map(applicationCode => {
      const application = applicationsMap.get(applicationCode)
      const person = createdPeopleMap.get(application.person.id)

      return this.$services.application.create(applicationCode, person._id)
                 .catch(console.error)
    })

    await Promise.all(applicationPromises)

    setTimeout(this.start.bind(this), this.$config.EXPA_API_RECURENCE)
  }
}

const factory = (services, bot) => {
  const http = axios.create({
    baseURL: config.EXPA_API_URL,
    params: {
      access_token: config.EXPA_API_TOKEN
    }
  })

  return new Monitor(http, config, services, bot)
}

module.exports = { factory }
