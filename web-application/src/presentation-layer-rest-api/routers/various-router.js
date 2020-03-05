const express = require('express')

module.exports = ({ }) => {

	const router = express.Router()

	router.get('/about', function (request, response) {
		response.status(200).json(users)
	})

	/*router.get("/", (request, response) => {
		response.render("home.hbs")
	})

	router.get("/about", (request, response) => {
		response.render("about.hbs")
	})

	router.get("/contact", (request, response) => {
		response.render("contact.hbs")
	})

	router.get("/401", (request, response) => {
		response.render("statuscode-401.hbs")
	})

	router.get("/500", (request, response) => {
		response.render("statuscode-500.hbs")
	})

	return router*/

}