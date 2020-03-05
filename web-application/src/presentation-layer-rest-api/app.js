/*const express = require('express')
const bodyParser = require('body-parser')

// Create the dependency-injection container.
//const container = require('../main')

//const VariousRouter = container.resolve('VariousRouter')
//const AccountRouter = container.resolve('AccountRouter')

// Create the express application.
const app = express()

// Setup express Handlebars.
//app.set('views', path.join(__dirname, 'views'))

/*app.engine('hbs', expressHandlebars({
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
*/

// Handles parsing data from the request body.
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: false }));

/*const users = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }]
app.get('/users', function (request, response, next) {
    response.status(200).json(users)
    next()
})*/
/*app.get('/users/:id', function (request, response) {
    const id = parseInt(request.params.id)
    const user = users.find(user => user.id == id)
    if (user) {
        response.status(200).json(user)
    } else {
        response.status(404).end()
    }
})*/

/*app.get('/api', function (request, response) {
    response.status(200).json(users)
    console.log("dududududu")
})*/

// Attach all routers.
//app.use('/api/', VariousRouter) //todo not used
//app.use('/api/accounts', AccountRouter) //todo not used
//app.use('/questions', QuestionRouter)

/*
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

module.exports = app 
*/