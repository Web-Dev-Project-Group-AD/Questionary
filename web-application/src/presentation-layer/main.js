const awilix = require('awilix')

const container = awilix.createContainer()

// Presentation-layer
const VariousRouter = require('./routers/various-router')
const AccountRouter = require('./routers/account-router')
const QuestionRouter = require('./routers/question-router')

container.register("VariousRouter", awilix.asFunction(VariousRouter))
container.register("AccountRouter", awilix.asFunction(AccountRouter))
container.register('QuestionRouter', awilix.asFunction(QuestionRouter))

// Business-logic-layer
const AccountManager = require('../business-logic-layer/account-manager')
const AccountValidator = require('../business-logic-layer/account-validator')
const QuestionManager = require('../business-logic-layer/question-manager')
const QuestionValidator = require('../business-logic-layer/question-validator')

container.register("AccountManager", awilix.asFunction(AccountManager))
container.register("AccountValidator", awilix.asFunction(AccountValidator))
container.register("QuestionManager", awilix.asFunction(QuestionManager))
container.register("QuestionValidator", awilix.asFunction(QuestionValidator))

// Choose either Data-access-layer or Data-access-layer-sequelize

/*
// Data-access-layer 
const database = require('../data-access-layer/db')
const AccountRepository = require('../data-access-layer/account-repository')
const QuestionRepository = require('../data-access-layer/question-repository')

container.register("database", awilix.asClass(database))
container.register("AccountRepository", awilix.asFunction(AccountRepository))
container.register("QuestionRepository", awilix.asFunction(QuestionRepository))
*/

// Data-access-layer-sequelize
const sequelize = require('../data-access-layer-sequelize/sequelize-setup')
const AccountModel = require('../data-access-layer-sequelize/models/account-model')
const QuestionCategoryModel = require('../data-access-layer-sequelize/models/question-category-model')
const QuestionModel = require('../data-access-layer-sequelize/models/question-model')
const AnswerModel = require('../data-access-layer-sequelize/models/answer-model')
const AccountRepository = require('../data-access-layer-sequelize/account-repository')
const QuestionRepository = require('../data-access-layer-sequelize/question-repository')

container.register("sequelize", awilix.asFunction(sequelize))
container.register("AccountModel", awilix.asFunction(AccountModel))
container.register("QuestionCategoryModel", awilix.asFunction(QuestionCategoryModel))
container.register("QuestionModel", awilix.asFunction(QuestionModel))
container.register("AnswerModel", awilix.asFunction(AnswerModel))
container.register("AccountRepository", awilix.asFunction(AccountRepository))
container.register("QuestionRepository", awilix.asFunction(QuestionRepository))


module.exports = container