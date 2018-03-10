'use strict'

class ApplicationsRepository {
  constructor (model) {
    this.$model = model
  }

  /**
   * Finds an application by its id
   * @param {Number} id Application id
   */
  async find (id) {
    return this.$model.findOne({ _id: id })
                      .lean()
  }
}

module.exports = ApplicationsRepository
