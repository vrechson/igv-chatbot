'use strict'

const { Schema } = require('mongoose')

const properties = {
  code: {
    type: Number,
    required: true
  }
}

const options = {
  id: false,
  collection: 'people',
  versionKey: false,
  strict: true
}

const schema = new Schema(properties, options)

const factory = (connection) => {
  return connection.model('Person', schema)
}

module.exports = schema
module.exports.factory = factory
