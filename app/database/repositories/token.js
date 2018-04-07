'use strict'

class ChatRepository {
  constructor (model) {
    this.$model = model
  }

  async get () {
    return this.$model.findOne({})
                      .lean()
  }
}

module.exports = ChatRepository
