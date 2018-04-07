'use strict'

const axios = require('axios')
const debug = require('debug')('igv-bot:monitor')
const config = require('../config')
const moment = require('moment')

class Monitor {
  constructor (http, config, services, bot) {
    this.$http = http
    this.$config = config
    this.$services = services
    this.$bot = bot
  }

  async notifyJoining (peopleMap) {
    const chatsToNotify = await this.$services.chat.findAll()
      .then(chats => chats.map(chat => chat.chatId))

    for (const chatId of chatsToNotify) {
      const notificationPromises = Array.from(peopleMap.keys()).map(key => {
        const { full_name: fullName, home_lc: { country } } = peopleMap.get(key)

        const text = `${fullName} just applied from ${country}`

        return this.$bot.sendMessage(chatId, text, {
          reply_markup: {
            inline_keyboard: [
              [ { text: 'TAKE', callback_data: `take_${key}`, } ],
              [ { text: 'REJECT', callback_data: `reject_${key}`, } ]
            ]
          }
        })
      })

      for (const promise of notificationPromises) {
        await promise
      }
    }
  }

  async start () {
    debug('Running monitor')
    const applications = []
    let currentPage = 1
    let totalItems = 1
    let lastItemCount = 101
    const date = moment().format("YYYY-MM-DD")

    while (applications.length < totalItems && lastItemCount >= 100) {
      debug(`Requesting page ${currentPage} of ${Math.ceil(totalItems / 100)}`)
      const { data } = await this.$http.get('/applications', {
        params: {
          'filters[status]': 'open',
          'filters[my]': 'opportunity',
          'filters[created_at][from]': date,
          page: currentPage++,
          per_page: 100
        }
      })

      totalItems = data.paging.total_items

      applications.push(...data.data)

      lastItemCount = data.data.length
    }

    const peopleMap = applications.reduce((set, application) => {
      return set.set(application.person.id, application.person)
    }, new Map())

    const personCodes = Array.from(peopleMap.keys())

    const dbPeople = await this.$services.person.listCodes()

    const newPeople = personCodes.filter(id => !dbPeople.includes(id))

    const newPeopleMap = newPeople.reduce((set, id) => {
      return set.set(id, peopleMap.get(id))
    }, new Map())

    debug('creating', newPeople.length, 'new people')

    const personPromises = newPeople.map(async personCode => {
      const person = peopleMap.get(personCode)
      return this.$services.person.create(personCode, person.full_name)
        .catch(console.error)
    })

    await this.notifyJoining(newPeopleMap)

    const createdPeople = await Promise.all(personPromises)

    const createdPeopleMap = createdPeople.reduce((map, createdPerson) => {
      return map.set(createdPerson.code, createdPerson)
    }, new Map())

    const applicationsMap = applications.reduce((map, application) => {
      return map.set(application.id, application)
    }, new Map())

    const applicationCodes = Array.from(applicationsMap.keys())

    const dbApplications = await this.$services.application.listCodes()

    const newApplications = applicationCodes.filter(id => {
      return !dbApplications.includes(id)
    })

    debug('creating', newApplications.length, 'new applications')

    const applicationPromises = newApplications.map(async applicationCode => {
      const application = applicationsMap.get(applicationCode)
      const person = createdPeopleMap.get(application.person.id)
          || await this.$services.person.findByCode(application.person.id)

      return this.$services.application.create(applicationCode, person._id, application.opportunity.id)
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
