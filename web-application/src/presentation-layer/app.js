
// Include all requires.
const path = require('path')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const redis = require('redis')
const Sequelize = require('sequelize')

// Create the sequelize database.
const sequelize = new Sequelize('sqlite:my-database.db')



// Create the dependency-injection container.
const container = require('./main')

const variousRouter = container.resolve("variousRouter")
const accountRouter = container.resolve("accountRouter")

// Create the express application.
const app = express()

// Setup express Handlebars.
app.set('views', path.join(__dirname, 'views'))

app.engine('hbs', expressHandlebars({
	extname: 'hbs',
	defaultLayout: 'main',
	layoutsDir: path.join(__dirname, 'layouts')
}))

const hbs = expressHandlebars.create({})

// Create Handlebars-helper for passing json-objects to client.
hbs.handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
})

// Handle static files in the public folder.
app.use(express.static(path.join(__dirname, 'public')))

// Handles parsing data from the request body.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

// Setup sessions and session storage
let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({ host:'redis' })

app.use(session({
	name: 'login',
	saveUninitialized: false,
	resave: false,
	secret: '9hTYuxloxt',
	store: new RedisStore({ client: redisClient }),
	cookie: {
		maxAge: 2 * 60 * 60 * 1000, // Set maxAge of sessions to 2 hours.
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