'use strict'

module.exports = async (msg, bot) => {
  await bot.sendMessage(msg.chat.id, 'Cria asa periquito!')
  await bot.sendDocument(msg.chat.id, 'https://giphy.com/gifs/brazil-PSKAppO2LH56w')
}
