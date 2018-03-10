'use strict'

const { pick } = require('lodash')
const NotFoundError = require('./errors/not-found-error')
const InvalidParameterError = require('./errors/invalid-parameter-error')

class ApplicationService {
  /**
   * @param {ApplicationRepository} respository Application repository instance
   * @param {ApplicationStorage} storage Application storage instance
   */
  constructor (respository, storage) {
    this.$repository = respository
    this.$storage = storage
  }

  /**
   * Finds an application by its id
   * @param {Number} id Id of the application
   */
  async find (id) {
    const application = await this.$repository.find(id)

    if (!application) {
      throw new NotFoundError(id)
    }

    return application
  }

  /**
   * Creates a new application
   * @param {Object} params New application data
   */
  async create (params) {
    const application = pick(params, [
      '_id',
      'person._id'
    ])

    if (isNaN(application._id)) {
      throw new InvalidParameterError('application id')
    }

    if (isNaN(application.person._id)) {
      throw new InvalidParameterError('person id')
    }

    return this.$storage.create(params)
  }
}

module.exports = ApplicationService
module.exports.NotFoundError = NotFoundError
module.exports.InvalidParameterError = InvalidParameterError
