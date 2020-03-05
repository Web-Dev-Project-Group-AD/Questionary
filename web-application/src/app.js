const express = require('express')

const webAppRoutes = require('./presentation-layer/app')
const restApiRoutes = require('./presentation-layer-rest-api/app')

const app = express()

app.use(restApiRoutes)
app.use(webAppRoutes)

app.listen(8080)