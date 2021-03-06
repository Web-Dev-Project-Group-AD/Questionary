const awilix = require("awilix")

const container = awilix.createContainer()

// Presentation-layer
const VariousRouter = require("./presentation-layer/routers/various-router")
const VarRouter = require("./presentation-layer-rest-api/routers/various-router")
const generateToken = require("./presentation-layer-rest-api/generateToken")
const authorizeLogin = require("./presentation-layer-rest-api/routers/middleware")
const AccountRouter = require("./presentation-layer/routers/account-router")
const AccountRouterApi = require("./presentation-layer-rest-api/routers/account-router")
const QuestionRouter = require("./presentation-layer/routers/question-router")
const QuestionRouterApi = require("./presentation-layer-rest-api/routers/question-router")
const expressHandlebars = require("./presentation-layer/handlebars-setup")
const expressSession = require("./presentation-layer/sessions/session-setup")
const SessionAuthorizer = require("./presentation-layer/sessions/session-authorizer")
const SessionRedirector = require("./presentation-layer/sessions/session-redirector")
const csrfProtection = require("./presentation-layer/csurf-setup")

container.register("VariousRouter", awilix.asFunction(VariousRouter))
container.register("VarRouter", awilix.asFunction(VarRouter))
container.register("generateToken", awilix.asFunction(generateToken))
container.register("authorizeLogin", awilix.asFunction(authorizeLogin))
container.register("AccountRouter", awilix.asFunction(AccountRouter))
container.register("AccountRouterApi", awilix.asFunction(AccountRouterApi))
container.register("QuestionRouter", awilix.asFunction(QuestionRouter))
container.register("QuestionRouterApi", awilix.asFunction(QuestionRouterApi))
container.register("expressHandlebars", awilix.asFunction(expressHandlebars))
container.register("expressSession", awilix.asFunction(expressSession))
container.register("SessionAuthorizer", awilix.asFunction(SessionAuthorizer))
container.register("SessionRedirector", awilix.asFunction(SessionRedirector))
container.register("csrfProtection", awilix.asFunction(csrfProtection))

// Business-logic-layer
const AccountManager = require("./business-logic-layer/account-manager")
const GoogleAuthManager = require("./business-logic-layer/google-auth-manager")
const AccountValidator = require("./business-logic-layer/account-validator")
const QuestionManager = require("./business-logic-layer/question-manager")
const QuestionValidator = require("./business-logic-layer/question-validator")
const searchOptions = require("./business-logic-layer/search-options")
const SearchManager = require("./business-logic-layer/search-manager")

container.register("AccountManager", awilix.asFunction(AccountManager))
container.register("GoogleAuthManager", awilix.asFunction(GoogleAuthManager))
container.register("AccountValidator", awilix.asFunction(AccountValidator))
container.register("QuestionManager", awilix.asFunction(QuestionManager))
container.register("QuestionValidator", awilix.asFunction(QuestionValidator))
container.register("searchOptions", awilix.asValue(searchOptions))
container.register("SearchManager", awilix.asFunction(SearchManager))

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

module.exports = container