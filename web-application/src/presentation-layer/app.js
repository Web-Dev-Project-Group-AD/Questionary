
// Include all requires.
//require("dotenv").config()

const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")

// Create the dependency-injection container.
const container = require("../main")

const VariousRouter = container.resolve("VariousRouter")
const AccountRouter = container.resolve("AccountRouter")
const QuestionRouter = container.resolve("QuestionRouter")

const sequelizeSync = container.resolve("sequelizeSync")
const handlebars = container.resolve("expressHandlebars")
const session = container.resolve("expressSession")

// Create the express application.
const app = express()

// Setup express Handlebars.
app.set("views", path.join(__dirname, "views"))

app.engine("hbs", handlebars.engine)

// Handle static files in the public folder.
app.use(express.static(path.join(__dirname, "public")))

// Handles parsing data from the request body.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

// Setup sessions and session storage
app.use(session)

// Attach all routers.
app.use("/", VariousRouter)
app.use("/accounts", AccountRouter)
app.use("/questions", QuestionRouter)

module.exports = app