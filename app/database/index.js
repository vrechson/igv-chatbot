'use strict'

const mongoose = require('mongoose')
const config = require('../../config')

const ApplicationModel = require('./models/application')
const ApplicationsStorage = require('./storages/applications')
const ApplicationsRepository = require('./repositories/applications')

const ChatModel = require('./models/chat')
const ChatStorage = require('./storages/chat')
const ChatRepositories = require('./repositories/chat')

const PersonModel = require('./models/person')
const PersonStorage = require('./storages/person')
const PersonRepository = require('./repositories/person')

const TokenModel = require('./models/token')
const TokenStorage = require('./storages/token')
const TokenRepository = require('./repositories/token')

const factory = () => {
  const connection = mongoose.createConnection(config.MONGO_DB_URI)

  const models = {
    chat: ChatModel.factory(connection),
    token: TokenModel.factory(connection),
    person: PersonModel.factory(connection),
    application: ApplicationModel.factory(connection)
  }

  const repositories = {
    chat: new ChatRepositories(models.chat),
    token: new TokenRepository(models.token),
    person: new PersonRepository(models.person),
    application: new ApplicationsRepository(models.application)
  }

  const storages = {
    chat: new ChatStorage(models.chat),
    token: new TokenStorage(models.token),
    person: new PersonStorage(models.person),
    application: new ApplicationsStorage(models.application)
  }

  return { repositories, storages }
}

module.exports = { factory }
