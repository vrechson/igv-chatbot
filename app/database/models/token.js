'use strict'

const { Schema } = require('mongoose')

const properties = {
  token: {
    type: String,
    required: true
  }
}

const options = {
  id: false,
  collection: 'token',
  strict: true,
  safe: true,
  versionKey: false,
  timestamps: false
}

const schema = new Schema(properties, options)

const factory = connection => {
  return connection.model('Token', schema)
}

module.exports = { factory }
