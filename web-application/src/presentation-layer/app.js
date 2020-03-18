
//require("dotenv").config()

const path = require("path")
const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

const container = require("../main")

const csrfProtection = container.resolve("csrfProtection")
const VariousRouter = container.resolve("VariousRouter")
const AccountRouter = container.resolve("AccountRouter")
const QuestionRouter = container.resolve("QuestionRouter")
const sequelizeSync = container.resolve("sequelizeSync")
const handlebars = container.resolve("expressHandlebars")
const session = container.resolve("expressSession")

const app = express()

app.set("views", path.join(__dirname, "views"))
app.engine("hbs", handlebars.engine)

app.use(express.static(path.join(__dirname, "public")))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(session)

app.use("/", VariousRouter)
app.use("/accounts", AccountRouter)
app.use("/questions", QuestionRouter)


module.exports = app