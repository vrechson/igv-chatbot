'use strict'

const { Schema } = require('mongoose')

const properties = {
  code: {
    type: Number,
    required: true
  }
}

const options = {
  collection: 'people',
  id: false,
  safe: true,
  strict: true,
  timestamps: false,
  versionKey: false
}

const schema = new Schema(properties, options)

const factory = (connection) => {
  return connection.model('Person', schema)
}

module.exports = schema
module.exports.factory = factory
