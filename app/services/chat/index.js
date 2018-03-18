'use strict'

const Error = require('./errors/error')
const ExistingChatError = require('./errors/existing-chat-error')

class ChatService {
  constructor (repository, storage) {
    this.$repository = repository
    this.$storage = storage
  }

  async findByChatId (chatId) {
    return this.$repository.findByChatId(chatId)
  }

  async findAll () {
    return this.$repository.findAll()
  }

  async create (chatId, name) {
    const chat = await this.$repository.findByChatId(chatId)

    if (chat) {
      throw new ExistingChatError(chatId)
    }

    return this.$storage.create(chatId, name)
  }

  async delete (id) {
    await this.$storage.delete()
  }
}

module.exports = ChatService
module.exports.Error = Error
