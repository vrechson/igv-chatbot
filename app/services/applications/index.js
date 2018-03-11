'use strict'

const Error = require('./errors/error')
const PersonService = require('../person')
const NotFoundError = require('./errors/not-found-error')
const PersonNotFoundError = require('./errors/person-not-found-error')

const errorHandler = (err) => {
  if (err instanceof PersonService.NotFoundError) {
    throw new PersonNotFoundError(err.message)
  }

  throw new Error(err.message, err.stack)
}

class ApplicationService {
  /**
   * @param {ApplicationRepository} respository Application repository instance
   * @param {ApplicationStorage} storage Application storage instance
   * @param {PersonService} personService Person service instance
   */
  constructor (respository, storage, personService) {
    this.$repository = respository
    this.$storage = storage
    this.$personService = personService
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
   * Returns the codes of all existing applications
   * @returns {Promise<Array[Number]>}
   */
  async listCodes () {
    return this.$repository.list()
                           .then(results => results.map(x => x.code))
  }

  /**
   * Creates a new application
   * @param code Application code
   * @param personId Id of the person
   * @returns {Promise<Object>}
   */
  async create (code, personId) {
    await this.$personService.find(personId)
                             .catch(errorHandler)

    const application = {
      code,
      person: {
        _id: personId
      }
    }

    return this.$storage.create(application)
  }
}

module.exports = ApplicationService
module.exports.NotFoundError = NotFoundError
