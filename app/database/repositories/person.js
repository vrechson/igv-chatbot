'use strict'

class PersonRepository {
  constructor (model) {
    this.$model = model
  }

  /**
   * Finds an person by its id
   * @param {String} id person id
   */
  async find (id) {
    return this.$model.findOne({ _id: id })
                      .lean()
  }

  /**
   * Returns all existing people
   * @returns {Promise<Array[Object]>}
   */
  async list () {
    return this.$model.find({})
               .lean()
  }
}

module.exports = PersonRepository
