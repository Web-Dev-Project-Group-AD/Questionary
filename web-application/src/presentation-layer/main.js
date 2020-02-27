const awilix = require('awilix')

const container = awilix.createContainer()

// Presentation-layer
const variousRouter = require('./routers/various-router')
const accountRouter = require('./routers/account-router')
const questionRouter = require('./routers/question-router')

container.register("variousRouter", awilix.asFunction(variousRouter))
container.register("accountRouter", awilix.asFunction(accountRouter))
container.register('questionRouter', awilix.asFunction(questionRouter))

// Business-logic-layer
const accountManager = require('../business-logic-layer/account-manager')
const accountValidator = require('../business-logic-layer/account-validator')

container.register("accountManager", awilix.asFunction(accountManager))
container.register("accountValidator", awilix.asFunction(accountValidator))


// Choose either Data-access-layer or Data-access-layer-sequelize

// Data-access-layer 

const Database = require('../data-access-layer/db')
container.register("database", awilix.asClass(Database))





const accountRepository = require('../data-access-layer/account-repository')

//container.register("database", awilix.asClass(database))
container.register("accountRepository", awilix.asFunction(accountRepository))


// Data-access-layer-sequelize
/*
const sequelize = require('../data-access-layer-sequelize/sequelize-setup')
const accountRepository = require('../data-access-layer-sequelize/account-repository')

container.register("sequelize", awilix.asFunction(sequelize))
container.register("accountRepository", awilix.asFunction(accountRepository))
*/

module.exports = container