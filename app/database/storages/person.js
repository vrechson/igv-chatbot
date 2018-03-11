'use strict'

const { pick } = require('lodash')

class PersonStorage {
  constructor (model) {
    this.$model = model
  }

  /**
   * Creates a person
   * @param code Person's code
   * @returns {Promise<Object>}
   */
  async create (code) {
    return this.$model.create({ code }, { new: true })
                      .then(document => document.toObject())
  }
}

module.exports = PersonStorage
