'use strict'

class ChatStorage {
  constructor (model) {
    this.$model = model
  }

  async set(token) {
    const existingToken = await this.$model.findOne({})
      
    if (!existingToken) {
      return this.$model.create({ token })
                        .then(document => document.toObject())
    }

    return this.$model.findOneAndUpdate({}, { token })
               .then(document => document.toObject())
  }
}

module.exports = ChatStorage
