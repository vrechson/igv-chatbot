'use strict'

module.exports = async (msg, bot) => {
  await bot.sendMessage(msg.chat.id, 'Usage instructions:')
  await bot.sendMessage(msg.chat.id, '\/last <n>: list n last applications.')
  await bot.sendMessage(msg.chat.id, '\/first <n>: list n first applications.')
  await bot.sendMessage(msg.chat.id, '\/rand <n>: list n rand applications.')
  await bot.sendMessage(msg.chat.id, '\/help: show this instructions.')
}
