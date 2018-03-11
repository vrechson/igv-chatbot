'use strict'

module.exports = async (msg, bot) => {
  await bot.sendMessage(msg.chat.id, 'Usage instructions:')
  await bot.sendDocument(msg.chat.id, '\/first <n>: list n fist applications.')
  await bot.sendDocument(msg.chat.id, '\/last <n>: list n last applications.')
  await bot.sendDocument(msg.chat.id, '\/rand <n>: list n rand applications.')
  await bot.sendDocument(msg.chat.id, '\/help: show this instructions.')
}
