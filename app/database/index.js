'use strict'

const mongoose = require('mongoose')
const config = require('../../config')

const ApplicationModel = require('./models/application')
const ApplicationsStorage = require('./storages/applications')
const ApplicationsRepository = require('./repositories/applications')

const PersonModel = require('./models/person')
const PersonStorage = require('./storages/person')
const PersonRepository = require('./repositories/person')

const factory = () => {
  const connection = mongoose.createConnection(config.MONGO_DB_URI)

  const models = {
    application: ApplicationModel.factory(connection),
    person: PersonModel.factory(connection)
  }

  const repositories = {
    application: new ApplicationsRepository(models.application),
    person: new PersonRepository(models.person)
  }

  const storages = {
    application: new ApplicationsStorage(models.application),
    person: new PersonStorage(models.person)
  }

  return { repositories, storages }
}

module.exports = { factory }
