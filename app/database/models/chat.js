'use strict'

const { Schema } = require('mongoose')

const properties = {
  chatId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  }
}

const options = {
  id: false,
  collection: 'chats',
  strict: true,
  safe: true,
  versionKey: false,
  timestamps: false
}

const schema = new Schema(properties, options)

const factory = connection => {
  return connection.model('Chat', schema)
}

module.exports = { factory }
