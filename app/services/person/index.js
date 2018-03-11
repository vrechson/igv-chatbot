'use strict'

const Error = require('./errors/error')
const NotFoundError = require('./errors/not-found-error')
const InvalidParameterError = require('./errors/invalid-parameter-error')

class PersonService {
  /**
   * @param {PersonRepository} repository Person repository instance
   * @param {PersonStorage} storage Person storage instance
   */
  constructor (repository, storage) {
    this.$repository = repository
    this.$storage = storage
  }

  /**
   * Finds a person by its id
   * @param id Id of the person
   * @returns {Promise<Object>}
   */
  async find (id) {
    const person = await this.$repository.find(id)

    if (!person) {
      throw new NotFoundError(id)
    }

    return person
  }

  /**
   * Returns the codes of all existing people
   * @returns {Promise<Array[Number]>}
   */
  async listCodes () {
    return this.$repository.list()
                           .then(results => results.map(x => x.code))
  }

  /**
   * Creates a new person
   * @param code code of the person
   * @returns {Promise<Object>}
   */
  async create (code) {
    if (isNaN(code)) {
      throw new InvalidParameterError('person code')
    }

    return this.$storage.create(parseInt(code))
  }
}

module.exports = PersonService
module.exports.Error = Error
module.exports.NotFoundError = NotFoundError
module.exports.InvalidParameterError = InvalidParameterError
