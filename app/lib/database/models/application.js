'use strict'

const { Schema } = require('mongoose')

const properties = {
  _id: {
    type: Number,
    required: true
  },
  person: {
    _id: {
      type: Number,
      required: true
    }
  }
}

const options = {
  _id: false,
  id: false,
  collection: 'applications',
  versionKey: false,
  strict: true
}

const schema = new Schema(properties, options)

const factory = (connection) => {
  return connection.model('Application', schema)
}

module.exports = schema
module.exports.factory = factory
