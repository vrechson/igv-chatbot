'use strict'

class ChatStorage {
  constructor (model) {
    this.$model = model
  }

  async create (id, name) {
    const chat = {
      chatId: id,
      name
    }

    return this.$model.create(chat)
                      .then(document => document.toObject())
  }

  async delete (id) {
    const update = {
      $set: {
        deletedAt: new Date()
      }
    }

    await this.$model.findOneAndUpdate({ _id: id }, update)
  }
}

module.exports = ChatStorage
