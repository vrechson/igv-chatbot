'use strict'

const ApplicationService = require('../services/applications')

module.exports = async (msg, match, { bot, services }) => {
  const application = await services.applications.find(match[ 1 ])
    .catch(err => {
      bot.sendMessage(msg.chat.id, err.message)
    })

  if (application) {
    const message = JSON.stringify(application, null, 4)
    bot.sendMessage(msg.chat.id, `\`\`\`${message}\`\`\``, { parse_mode: 'Markdown' })
  }
}
