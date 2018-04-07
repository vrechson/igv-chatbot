'use strict'

class ChatRepository {
  constructor (model) {
    this.$model = model
  }

  async findAll () {
    return this.$model.find({ deletedAt: { $eq: null } })
                      .lean()
  }

  async findByChatId (id) {
    return this.$model.findOne({ chatId: id })
                      .lean()
  }
}

module.exports = ChatRepository
