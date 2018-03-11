'use strict'

const { pick } = require('lodash')

class PersonStorage {
  constructor (model) {
    this.$model = model
  }

  async create (code) {

    return this.$model.create({ code }, { new: true })
                      .then(document => document.toObject())
  }
}

module.exports = PersonStorage
