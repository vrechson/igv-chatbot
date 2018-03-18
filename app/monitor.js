'use strict'

const axios = require('axios')
const debug = require('debug')('igv-bot:monitor')
const config = require('../config')

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
        const { full_name, home_lc: { country } } = peopleMap.get(key)

        return this.$bot.sendMessage(chatId, `${full_name} just applied from ${country}`, {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: 'TAKE',
                            callback_data: "take",
                        }
                    ],
                    [
                        {
                            text: 'REJECT',
                            callback_data: "reject",
                        },
                    ],
                ],
            },
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

    while (applications.length < totalItems) {
      debug(`Requesting page ${currentPage} of ${Math.ceil(totalItems / 100)}`)
      const { data } = await this.$http.get('/applications', {
        params: {
          'filters[status]': 'open',
          'filters[my]': 'opportunity',
          page: currentPage++,
          per_page: 100
        }
      })

      totalItems = data.paging.total_items

      applications.push(...data.data)
    }

    const peopleMap = applications.reduce((set, application) => set.set(application.person.id, application.person), new Map())
    const personCodes = Array.from(peopleMap.keys())

    const dbPeople = await this.$services.person.listCodes()

    const newPeople = personCodes.filter(id => !dbPeople.includes(id))

    debug('creating', newPeople.length, 'new people')

    const personPromises = newPeople.map(async personCode => {
      const person = peopleMap.get(personCode)
      return this.$services.person.create(personCode, person.full_name)
                                  .catch(console.error)
    })

    await this.notifyJoining(peopleMap)

    const createdPeople = await Promise.all(personPromises)

    const createdPeopleMap = createdPeople.reduce((map, createdPerson) => {
      return map.set(createdPerson.code, createdPerson)
    }, new Map())

    const applicationsMap = applications.reduce((map, application) => map.set(application.id, application), new Map())
    const applicationCodes = Array.from(applicationsMap.keys())

    const dbApplications = await this.$services.application.listCodes()

    const newApplications = applicationCodes.filter(id => !dbApplications.includes(id))

    debug('creating', newApplications.length, 'new applications')

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
