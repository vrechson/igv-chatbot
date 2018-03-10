'use strict'

const { format } = require('util')
const ApplicationService = require('../services/applications')

module.exports = async (msg, match, { bot, services }) => {
  const errorHandler = (err) => {
    if (err instanceof ApplicationService.InvalidParameterError) {
      return bot.sendMessage(msg.chat.id, `Erro, parâmetro inválido: ${err.message}`)
    }

    return bot.sendMessage(msg.chat.id, `Erro: ${err.message}`)
  }

  if (!match[ 1 ] || !match[ 2 ]) {
    return bot.sendMessage(msg.chat.id, 'Uso: /create 123 123')
  }

  try {
    const application = await services.applications.create({
      _id: match[ 1 ],
      person: {
        _id: match[ 2 ]
      }
    })

    const message = format('```%s```', JSON.stringify(application, null, 4))

    bot.sendMessage(msg.chat.id, message, {
      parse_mode: 'Markdown'
    })
  } catch (err) {
    return errorHandler(err)
  }
}
