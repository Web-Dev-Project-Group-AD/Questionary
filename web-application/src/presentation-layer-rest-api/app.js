const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")

// Create the dependency-injection container.
const container = require("../main")

const VarRouter = container.resolve("VarRouter")
const AccountRouterApi = container.resolve("AccountRouterApi")
const QuestionRouterApi = container.resolve("QuestionRouterApi")
//const sequelizeSync = container.resolve("sequelizeSync")

// Create the express application.
const app = express()

// Better to only target the frontend application.
app.use(function (request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader("Access-Control-Allow-Methods", "*")
    response.setHeader("Access-Control-Allow-Headers", "*")
    response.setHeader("Access-Control-Expose-Headers", "*")
    next()
})

// Handles parsing data from the request body.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Attach all routers.
app.use('/', VarRouter)
app.use('/accounts', AccountRouterApi)
app.use('/questions', QuestionRouterApi)

console.log("here we are in rest api")

module.exports = app