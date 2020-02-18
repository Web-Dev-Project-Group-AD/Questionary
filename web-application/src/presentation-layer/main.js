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

//Choose either Data-access-layer or Data-access-layer-sequelize



// Data-access-layer
//const database = require('../data-access-layer/db')
//container.register("database", awilix.asFunction(database))
//const accountRepository = require('../data-access-layer/account-repository')

// Data-access-layer-sequelize

//const Sequelize = require('sequelize')
//const sequelize = new Sequelize('postgres:postgres-database.db')


//const database = require('../data-access-layer/postgres-database')

//container.register("sequelize", awilix.asFunction(sequelize))
const accountRepository = require('../data-access-layer-sequelize/account-repository')



container.register("accountRepository", awilix.asFunction(accountRepository))





module.exports = container
