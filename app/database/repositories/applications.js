'use strict'

class ApplicationRepository {
  constructor (model) {
    this.$model = model
  }

  /**
   * Finds an application by its id
   * @param {String} id Application id
   */
  async find (id) {
    return this.$model.findOne({ _id: id })
                      .lean()
  }

  /**
  * Find all applications of a person
  * @param personId Id of the person
  * @returns {Promise<Array[Object]>}
  **/
  async findByPerson (personId) {
    return this.$model.find({ 'person._id': personId })
                      .lean()
  }

  /**
   * Returns all existing applications
   * @returns {Promise<Array[Object]>}
   */
  async list () {
    return this.$model.find({})
                      .lean()
  }
}

module.exports = ApplicationRepository
