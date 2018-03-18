'use strict'

const config = require('../config')
const Monitor = require('./monitor')
const commands = require('./commands')
const database = require('./database')
const debug = require('debug')('igv-bot:app')
const ChatService = require('./services/chat')
const PersonService = require('./services/person')
const TelegramBot = require('node-telegram-bot-api')
const UserDataService = require('./services/user-data')
const ApplicationService = require('./services/applications')

/**
 * @returns {TelegramBot}
 */
const factory = () => {
  const { repositories, storages } = database.factory()

  const personService = new PersonService(repositories.person, storages.person)
  const applicationService = new ApplicationService(repositories.application, storages.application, personService)
  const chatService = new ChatService(repositories.chat, storages.chat)
  const userDataService = new UserDataService(config, applicationService, personService)

  const services = {
    person: personService,
    application: applicationService,
    chat: chatService,
    userData: userDataService
  }

  const bot = new TelegramBot(config.TELEGRAM_API_TOKEN, {
    polling: {
      autoStart: false
    }
  })

  bot.getMe()
     .then(me => { debug(`Listening on ${me.username}`) })

  const monitor = Monitor.factory(services, bot)

  monitor.start()

  bot.on('message', async (msg) => {
    if ('new_chat_members' in msg) {
      const joinedIds = msg.new_chat_members.map(user => user.id)

      const me = await bot.getMe()

      if (!joinedIds.includes(me.id)) {
        return
      }

      return commands.start(msg, bot, services)
                     .catch(console.error)
    }
  })

  bot.onText(/^\/start/, (msg, match) => {
    commands.start(msg, bot, services)
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

  bot.on("callback_query", async (callbackQuery) => {
    const msg = callbackQuery.message

    const [ operation, personId ] = callbackQuery.data.split('_')

    if (operation === 'take') {
      const applicant = await userDataService.find(personId)

      return bot.answerCallbackQuery(callbackQuery.id)
        .then(() => bot.editMessageText(`${callbackQuery.message.text}\n[+] taken by: ${callbackQuery.from.first_name} ${callbackQuery.from.last_name}`, { message_id: msg.message_id, chat_id: msg.chat.id }))
    }

    bot.answerCallbackQuery(callbackQuery.id)
      .then(() => bot.editMessageText(`${callbackQuery.message.text}\n[+] rejected by: ${callbackQuery.from.first_name} ${callbackQuery.from.last_name}`, { message_id: msg.message_id, chat_id: msg.chat.id }))
  });

  return bot
}

module.exports = { factory }
