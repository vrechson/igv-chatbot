'use strict'

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
    * Finds an person by its id
    * @param {Object}
    */
    async find (id) {
      const person = await this.$repository.find(id)

      if (!person) {
        throw new NotFoundError(id)
      }

      return person
    }

    async create (code) {
      if (isNaN(code)) {
        throw new InvalidParameterError("person code")
      }

      return this.$storage.create(code)
    }
}
