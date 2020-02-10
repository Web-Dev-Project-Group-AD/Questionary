const path = require('path')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')

const session = require('express-session')
const redis = require('redis')

const awilix = require('awilix')

// Import the ones we want to use (real or mockup), real in this case.
const accountManager = require('../business-logic-layer/account-manager')
const accountRepository = require('../data-access-layer/account-repository')
const accountValidator = require('../business-logic-layer/account-validator')
const accountRouter = require('./routers/account-router')

// Create a container and add the dependencies we want to use.
const container = awilix.createContainer({
	accountRepository: awilix.asFunction(accountRepository),
	accountManager: awilix.asFunction(accountManager),
	accountValidator: awilix.asFunction(accountValidator),
	accountRouter: awilix.asFunction(accountRouter)
})

//container.register("accountRepository", awilix.asFunction(accountRepository))
//container.register("accountManager", awilix.asFunction(accountManager))
//container.register("accountValidator", awilix.asFunction(accountValidator))
//container.register("accountRouter", awilix.asFunction(accountRouter))

// Retrieve the router, which resolves all other dependencies.
const theAccountRouter = container.resolve("accountRouter")

//const variousRouter = require('./routers/various-router')
//const accountRouter = require('./routers/account-router')

const app = express()

// Setup express-handlebars.
app.set('views', path.join(__dirname, 'views'))

app.engine('hbs', expressHandlebars({
	extname: 'hbs',
	defaultLayout: 'main',
	layoutsDir: path.join(__dirname, 'layouts')
}))

// Handle static files in the public folder.
app.use(express.static(path.join(__dirname, 'public')))

// Handles parsing data from the request body.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

// Handles the storage of the sessions.
let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({ host:'redis' })

app.use(session({
	name: 'login',
	saveUninitialized: false,
	resave: false,
	secret: '9hTYuxloxt',
	store: new RedisStore({ 
		client: redisClient
	}),
	cookie: {
		maxAge: 2 * 60 * 60 * 1000, // 2 hours
		sameSite: true,
		secure: false
	}
}))

// Attach all routers.
app.use('/', variousRouter)
app.use('/accounts', accountRouter)

// Start listening for incoming HTTP requests!
app.listen(8080, function () {
	console.log('Running on 8080!')
})