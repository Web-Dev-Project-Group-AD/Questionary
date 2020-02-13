const awilix = require('awilix')


// Create the dependency container
const container = awilix.createContainer()

// Presentation-layer
const accountRouter = require('./routers/account-router')
const variousRouter = require('./routers/various-router')

container.register("accountRouter", awilix.asFunction(accountRouter))
container.register("variousRouter", awilix.asFunction(variousRouter))


// Business-logic-layer
const accountManager = require('../business-logic-layer/account-manager')
const accountValidator = require('../business-logic-layer/account-validator')

container.register("accountManager", awilix.asFunction(accountManager))
container.register("accountValidator", awilix.asFunction(accountValidator))


// Data-access-layer
const database = require('../data-access-layer/db')
const accountRepository = require('../data-access-layer/account-repository')

container.register("database", awilix.asFunction(database))
container.register("accountRepository", awilix.asFunction(accountRepository))


// Data-access-layer-sequelize
const sequelizeHandler = require('../data-access-layer-sequelize/sequelize-handler')

container.register("sequelizeHandler", awilix.asFunction(sequelizeHandler))



module.exports = container
