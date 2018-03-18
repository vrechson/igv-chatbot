'use strict'

class PersonStorage {
  constructor (model) {
    this.$model = model
  }

  /**
   * Creates a person
   * @param code Person's code
   * @returns {Promise<Object>}
   */
  async create (code, name) {
    return this.$model.create({ code: code, name: name})
                      .then(document => document.toObject())
  }
}

module.exports = PersonStorage
