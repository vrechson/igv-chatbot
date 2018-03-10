'use strict'

const config = require('../config')
const commands = require('./lib/commands')
const database = require('./lib/database')
const TelegramBot = require('node-telegram-bot-api')

/**
 * Services
 */
const ApplicationService = require('./lib/services/applications')

const factory = () => {
  const { repositories, storages } = database.factory()

  const services = {
    applications: new ApplicationService(repositories.application, storages.application)
  }

  const bot = new TelegramBot(config.TELEGRAM_API_TOKEN, {
    polling: {
      autoStart: false
    }
  })

  const instances = {
    bot,
    services
  }

  bot.on('message', (msg) => {
    if ('new_chat_members' in msg) {
      return commands.start(msg, bot)
                     .catch(console.error)
    }
  })

  bot.onText(/^\/find (\d+)/ig, (msg, match) => commands.find(msg, match, instances))
  bot.onText(/^\/create (\d+) (\d+)/ig, (msg, match) => commands.create(msg, match, instances))

  return bot
}

module.exports = { factory }
