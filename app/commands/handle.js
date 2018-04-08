'use strict'

const { format } = require('util')

const MSG_TAKEN = '%s taken by %s'
const MSG_REJECTED = '%s rejected by %s'
const MSG_ERROR_TAKING_APPLICATION = 'Error taking application: %s'
const MSG_SEND_PRIVATE = '%s, send me a private message, then click take again!'

module.exports = async (callbackQuery, bot, { userData, person, chat }) => {
  const [ operation, personId ] = callbackQuery.data.split('_')

  const msg = callbackQuery.message

  const errorHandler = async err => {
    console.error(err.response ? err.response.data : err.message)
    const text = format(MSG_ERROR_TAKING_APPLICATION, err.message)
    await bot.sendMessage(msg.chat.id, text)
    await bot.answerCallbackQuery(callbackQuery.id)
  }

  const { first_name, last_name } = callbackQuery.from

  const taker = `${first_name} ${last_name || ''}`


  const applicant = await userData.find(personId)
                                  .catch(errorHandler)

  if (!applicant) {
    return
  }

  const text = operation === 'take'
    ? format(MSG_TAKEN, applicant.full_name, taker)
    : format(MSG_REJECTED, applicant.full_name, taker)

  await bot.answerCallbackQuery(callbackQuery.id)

  const fullName = applicant.full_name || "Esse mocinho não tem nome"

  const countryCode = applicant.contact_info
    ? applicant.contact_info.country_code
    : 'xx'

  const telefone = applicant.contact_info
    ? applicant.contact_info.phone
    : 'indisponível'

  const epmFullName = applicant.contacted_by
    ? applicant.contacted_by.full_name
    : 'indisponível'

  const epmCountryCode = applicant.contacted_by
    ? applicant.contacted_by.contact_info.country_code
    : countryCode

  const epmTelefone = applicant.contacted_by
    ? applicant.contacted_by.contact_info.phone
    : "indisponível"

  const applicantInfo = [
    fullName,
    `Telefone: ${countryCode} ${telefone}`,
    `EP Manager: ${epmFullName}`,
    `EP Manager phone: ${epmCountryCode} ${epmTelefone}`
  ]
  .join('\n')

  await bot.sendMessage(callbackQuery.from.id, applicantInfo)
   .then(async () => {
     await bot.editMessageText(text, {
       message_id: msg.message_id,
       chat_id: msg.chat.id
     })
   })
   .catch(async err => {
     console.error(err)
     await bot.sendMessage(msg.chat.id, format(MSG_SEND_PRIVATE, callbackQuery.from.first_name))
   })
}
