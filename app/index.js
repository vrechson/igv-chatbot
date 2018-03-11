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

  const services = {
    application: new ApplicationService(repositories.application, storages.application),
    person: new PersonService(repositories.person, storages.person)
  }

  const monitor = Monitor.factory(services)

  monitor.start()

  const bot = new TelegramBot(config.TELEGRAM_API_TOKEN, {
    polling: {
      autoStart: false
    }
  })

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

  bot.onText(/^\/start/, (msg) => {
    commands.start(msg, bot)
            .catch(console.error)
  })

  return bot
}

module.exports = { factory }
