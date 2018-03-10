'use strict'

const mongoose = require('mongoose')
const config = require('../../../config')

const ApplicationModel = require('./models/application')
const ApplicationsStorage = require('./storages/applications')
const ApplicationsRepository = require('./repositories/applications')

const factory = () => {
  const connection = mongoose.createConnection(config.MONGO_DB_URI)

  const models = {
    application: ApplicationModel.factory(connection)
  }

  const repositories = {
    application: new ApplicationsRepository(models.application)
  }

  const storages = {
    application: new ApplicationsStorage(models.application)
  }

  return { repositories, storages }
}

module.exports = { factory }
