const path = require('path')
const express = require('express')
const expressHandlebars = require('express-handlebars')

const variousRouter = require('./routers/various-router')
const accountRouter = require('./routers/account-router')

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

// Attach all routers.
app.use('/', variousRouter)
app.use('/accounts', accountRouter)

// Start listening for incoming HTTP requests!
app.listen(8080, function(){
	console.log('Running on 8080!')
})