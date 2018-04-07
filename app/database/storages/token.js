'use strict'

class ChatStorage {
  constructor (model) {
    this.$model = model
  }

  async set(token) {
    this.$model.findOneAndUpdate({}, { token })
               .then(document => document.toObject())
  }
}

module.exports = ChatStorage
