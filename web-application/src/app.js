const express = require('express')

// db connections
//require("./data-access-layer-sequelize/sequelize-setup");
//require("./data-access-layer-sequelize/sequelize-sync");
//require("./data-access-layer/db")

const webAppRoutes = require('./presentation-layer/app')
const restApiRoutes = require('./presentation-layer-rest-api/app')

const app = express()

app.use("/api", restApiRoutes)
app.use(webAppRoutes)

app.listen(8080)