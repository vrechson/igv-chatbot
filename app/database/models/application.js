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
  },
  opportunity: {
    _id: {
      type: Number,
      required: true
    }
  }
}

const options = {
  collection: 'applications',
  id: false,
  safe: true,
  strict: true,
  timestamps: false,
  versionKey: false
}

const schema = new Schema(properties, options)

const factory = (connection) => {
  return connection.model('Application', schema)
}

module.exports = schema
module.exports.factory = factory
