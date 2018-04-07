'use strict'

module.exports = async (msg, match, bot, services) => {
  const token = match[1]

  await services.token.set(token)

  bot.sendMessage(msg.chat.id, 'New token set')
}
