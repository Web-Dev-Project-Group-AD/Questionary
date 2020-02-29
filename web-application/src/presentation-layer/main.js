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
const questionManager = require('../business-logic-layer/question-manager')
const questionValidator = require('../business-logic-layer/question-validator')

container.register("accountManager", awilix.asFunction(accountManager))
container.register("accountValidator", awilix.asFunction(accountValidator))
container.register("questionManager", awilix.asFunction(questionManager))
container.register("questionValidator", awilix.asFunction(questionValidator))

// Choose either Data-access-layer or Data-access-layer-sequelize

// Data-access-layer 
const Database = require('../data-access-layer/db')
const accountRepository = require('../data-access-layer/account-repository')
const questionRepository = require('../data-access-layer/question-repository')

container.register("database", awilix.asClass(Database))
container.register("accountRepository", awilix.asFunction(accountRepository))
container.register("questionRepository", awilix.asFunction(questionRepository))

/*
// Data-access-layer-sequelize
const sequelize = require('../data-access-layer-sequelize/sequelize-setup')
const accountRepository = require('../data-access-layer-sequelize/account-repository')

container.register("sequelize", awilix.asFunction(sequelize))
container.register("accountRepository", awilix.asFunction(accountRepository))
*/

module.exports = container