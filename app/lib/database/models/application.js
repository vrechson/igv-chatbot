'use strict'

const { Schema } = require('mongoose')

const properties = {
  code: {
    type: Number,
    required: true
  },
  person: {
    _id: {
      type: Schema.Types.ObjectId,
      required: true
    }
  }
}

const options = {
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
