const awilix = require("awilix")

const container = awilix.createContainer()

// Presentation-layer
const VariousRouter = require("./presentation-layer/routers/various-router")
const VarRouter = require("./presentation-layer-rest-api/routers/various-router")
const AccountRouter = require("./presentation-layer/routers/account-router")
const QuestionRouter = require("./presentation-layer/routers/question-router")
const expressHandlebars = require("./presentation-layer/handlebars-setup")
const expressSession = require("./presentation-layer/session-setup")

container.register("VariousRouter", awilix.asFunction(VariousRouter))
container.register("VarRouter", awilix.asFunction(VarRouter))
container.register("AccountRouter", awilix.asFunction(AccountRouter))
container.register("QuestionRouter", awilix.asFunction(QuestionRouter))
container.register("expressHandlebars", awilix.asFunction(expressHandlebars))
container.register("expressSession", awilix.asFunction(expressSession))

// Presentation-layer-rest-api

//const AccountRouter = require("./presentation-layer/routers/account-router")
//const QuestionRouter = require("./presentation-layer/routers/question-router")
//const expressHandlebars = require("./presentation-layer/handlebars-setup")
//const expressSession = require("./presentation-layer/session-setup")

//container.register("AccountRouter", awilix.asFunction(AccountRouter))
//container.register("QuestionRouter", awilix.asFunction(QuestionRouter))
//container.register("expressHandlebars", awilix.asFunction(expressHandlebars))
//container.register("expressSession", awilix.asFunction(expressSession))

// Business-logic-layer
const AccountManager = require("./business-logic-layer/account-manager")
const AccountValidator = require("./business-logic-layer/account-validator")
const QuestionManager = require("./business-logic-layer/question-manager")
const QuestionValidator = require("./business-logic-layer/question-validator")
const SessionAuthenticator = require("./business-logic-layer/session-authenticator")
const SessionRedirector = require("./business-logic-layer/session-redirector")

container.register("AccountManager", awilix.asFunction(AccountManager))
container.register("AccountValidator", awilix.asFunction(AccountValidator))
container.register("QuestionManager", awilix.asFunction(QuestionManager))
container.register("QuestionValidator", awilix.asFunction(QuestionValidator))
container.register("SessionAuthenticator", awilix.asFunction(SessionAuthenticator))
container.register("SessionRedirector", awilix.asFunction(SessionRedirector))


// Choose either Data-access-layer or Data-access-layer-sequelize

/*
// Data-access-layer 
const database = require("./data-access-layer/db")
const AccountRepository = require("./data-access-layer/account-repository")
const QuestionRepository = require("./data-access-layer/question-repository")

container.register("database", awilix.asClass(database))
container.register("AccountRepository", awilix.asFunction(AccountRepository))
container.register("QuestionRepository", awilix.asFunction(QuestionRepository))
*/

// Data-access-layer-sequelize
const sequelize = require("./data-access-layer-sequelize/sequelize-setup")
const AccountModel = require("./data-access-layer-sequelize/models/account-model")
const QuestionCategoryModel = require("./data-access-layer-sequelize/models/question-category-model")
const QuestionModel = require("./data-access-layer-sequelize/models/question-model")
const AnswerModel = require("./data-access-layer-sequelize/models/answer-model")
const AccountRepository = require("./data-access-layer-sequelize/account-repository")
const QuestionRepository = require("./data-access-layer-sequelize/question-repository")
const sequelizeSync = require("./data-access-layer-sequelize/sequelize-sync")

container.register("sequelize", awilix.asFunction(sequelize))
container.register("AccountModel", awilix.asFunction(AccountModel))
container.register("QuestionCategoryModel", awilix.asFunction(QuestionCategoryModel))
container.register("QuestionModel", awilix.asFunction(QuestionModel))
container.register("AnswerModel", awilix.asFunction(AnswerModel))
container.register("sequelizeSync", awilix.asFunction(sequelizeSync))
container.register("AccountRepository", awilix.asFunction(AccountRepository))
container.register("QuestionRepository", awilix.asFunction(QuestionRepository))

//console.log("this is a questionModel:", QuestionModel)

module.exports = container