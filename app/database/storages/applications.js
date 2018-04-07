'use strict'

const { pick } = require('lodash')

class ApplicationStorage {
  constructor (model) {
    this.$model = model
  }

  /**
   * Creates an application
   * @param params New application information
   * @returns {Promise<Object>}
   */
  async create (params) {
    const application = pick(params, [
      'code',
      'person._id',
      'opportunity._id'
    ])

    return this.$model.create(application)
                      .then(document => document.toObject())
  }
}

module.exports = ApplicationStorage
