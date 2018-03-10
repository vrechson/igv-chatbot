'use strict'

module.exports = async (msg, bot) => {
  const joinedIds = msg.new_chat_members.map(user => user.id)

  const me = await bot.getMe()

  if (joinedIds.includes(me.id)) {
    await bot.sendMessage(msg.chat.id, 'Cria asa periquito!')
    await bot.sendDocument(msg.chat.id, 'https://giphy.com/gifs/brazil-PSKAppO2LH56w')
  }
}
