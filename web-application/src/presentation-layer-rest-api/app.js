const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")

// Create the dependency-injection container.
const container = require("../main")

const VarRouter = container.resolve("VarRouter")
const AccountRouterApi = container.resolve("AccountRouterApi")
//const QuestionRouter = container.resolve("QuestionRouter")

const sequelizeSync = container.resolve("sequelizeSync")
//const handlebars = container.resolve("expressHandlebars")

// Create the express application.
const app = express()

// Setup express Handlebars.
//app.set("views", path.join(__dirname, "views"))

app.use(express.static("static-files"))

//app.engine("hbs", handlebars.engine)

// Handle static files in the layout folder.
//app.use(express.static(path.join(__dirname, "./layout")))

// Handles parsing data from the request body.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Better to only target the frontend application.
app.use(function (request, response, next) {
    response.setHeader("Access-Control-Allow-Origin", "*")
    response.setHeader("Access-Control-Allow-Methods", "*")
    response.setHeader("Access-Control-Allow-Headers", "*")
    response.setHeader("Access-Control-Expose-Headers", "*")
    next()
})

//app.use(express.static("views"))



// Attach all routers.
app.use("/api", VarRouter)
app.use("/api/accounts", AccountRouterApi)

// If the request is for a resource not found in the static folder,
// send back the index.html file, and let client-side JS show the
// correct page.
app.use(function(request, response, next){
    response.sendFile(__dirname+"/static-files/index.html")
})

console.log("here we are in rest api")

module.exports = app