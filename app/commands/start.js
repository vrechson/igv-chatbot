'use strict'

module.exports = async (msg, bot, services) => {
  if (['group', 'supergroup', 'channel'].includes(msg.chat.type)) {
    await services.chat.create(msg.chat.id, msg.chat.title || 'N/A')
  }

  await bot.sendMessage(msg.chat.id, 'Cria asa periquito!')
  await bot.sendDocument(msg.chat.id, 'https://giphy.com/gifs/brazil-PSKAppO2LH56w')
}
