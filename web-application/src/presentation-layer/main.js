const awilix = require('awilix')

const accountRouter = require('./routers/account-router')
const variousRouter = require('./routers/various-router')

const accountManager = require('../business-logic-layer/account-manager')
const accountRepository = require('../data-access-layer/account-repository')
const accountValidator = require('../business-logic-layer/account-validator')
const database = require('../data-access-layer/db')

const container = awilix.createContainer()
container.register("accountRouter", awilix.asFunction(accountRouter))
container.register("variousRouter", awilix.asFunction(variousRouter))
container.register("accountRepository", awilix.asFunction(accountRepository))
container.register("accountManager", awilix.asFunction(accountManager))
container.register("accountValidator", awilix.asFunction(accountValidator))

container.register("database", awilix.asFunction(database))

module.exports = container

//const theAccountRouter = accountContainer.resolve("accountRouter")

