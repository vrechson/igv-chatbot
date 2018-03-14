'use strict'

const config = require('../config')
const Monitor = require('./monitor')
const commands = require('./commands')
const database = require('./database')
const TelegramBot = require('node-telegram-bot-api')

/**
 * SERVICES
 * @returns {TelegramBot}
 */
const ApplicationService = require('./services/applications')
const PersonService = require('./services/person')

const factory = () => {
  const { repositories, storages } = database.factory()

  const personService = new PersonService(repositories.person, storages.person)
  const applicationService = new ApplicationService(repositories.application, storages.application, personService)

  const services = {
    person: personService,
    application: applicationService
  }

  const bot = new TelegramBot(config.TELEGRAM_API_TOKEN, {
    polling: {
      autoStart: false
    }
  })

  const monitor = Monitor.factory(services, bot, msg)

  monitor.start()

  bot.on('message', async (msg) => {
    if ('new_chat_members' in msg) {
      const joinedIds = msg.new_chat_members.map(user => user.id)

      const me = await bot.getMe()

      if (!joinedIds.includes(me.id)) {
        return
      }

      return commands.start(msg, bot)
                     .catch(console.error)
    }
  })

  bot.onText(/^\/start/, (msg, match) => {
    commands.start(msg, bot)
            .catch(console.error)
  })

  bot.onText(/^\/first (\d)/, (msg, match) => {
    commands.first(msg, bot, match[1], PersonService)
            .catch(console.error)
  })

  bot.onText(/^\/last (\d)/, (msg, match) => {
    commands.last(msg, bot, match[1], PersonService)
            .catch(console.error)
  })

  bot.onText(/^\/rand (\d)/, (msg, match) => {
    commands.rand(msg, bot, match[1], PersonService)
            .catch(console.error)
  })

  bot.onText(/^\/help/, (msg, match) => {
    commands.help(msg, bot)
            .catch(console.error)
  })

  return bot
}

module.exports = { factory }
