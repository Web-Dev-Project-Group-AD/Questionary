const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")
const cors = require('cors')
// Create the dependency-injection container.
const container = require("../main")

//const authorizeLogin = container.resolve("authorizeLogin")
const VarRouter = container.resolve("VarRouter")
const AccountRouterApi = container.resolve("AccountRouterApi")
const QuestionRouterApi = container.resolve("QuestionRouterApi")

// Create the express application.
const app = express()

// // Better to only target the frontend application.
// app.use(function (request, response, next) {
//     response.setHeader("Access-Control-Allow-Origin", "*")
//     response.setHeader("Access-Control-Allow-Methods", ["GET", "POST", "PUT", "DELETE"])
//     response.setHeader("Access-Control-Allow-Headers", "*")
//     response.setHeader("Access-Control-Expose-Headers", "*")
//     next()
// })



 
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE"]
}

app.use(cors(corsOptions))


// Handles parsing data from the request body.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
//app.use(authorizeLogin)

// Attach all routers.
app.use('/', VarRouter)
app.use('/accounts', AccountRouterApi)
app.use('/questions', QuestionRouterApi)

console.log("here we are in rest api")

module.exports = app