'use strict'

const { pick } = require('lodash')

class ApplicationStorage {
  constructor (model) {
    this.$model = model
  }

  async create (params) {
    const application = pick(params, [
      '_id',
      'person._id'
    ])

    return this.$model.create(application, { new: true })
                      .then(document => document.toObject())
  }
}

module.exports = ApplicationStorage
