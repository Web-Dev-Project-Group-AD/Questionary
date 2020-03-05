const express = require('express')

module.exports = ({ }) => {

	const router = express.Router()

	router.get("/", (request, response) => {

		const userStatus = request.session.userStatus

		response.render("home.hbs", userStatus)
	})

	// router.get("/about", (request, response) => {

	// 	const userStatus = request.session.userStatus

	// 	response.render("about.hbs", userStatus)
	// })

	// router.get("/contact", (request, response) => {

	// 	const userStatus = request.session.userStatus

	// 	response.render("contact.hbs", userStatus)
	// })

	router.get("/401", (request, response) =>{

		const userStatus = request.session.userStatus

		response.status(401).render("statuscode-401.hbs", userStatus)
	})

	router.get("/500", (request, response) =>{

		const userStatus = request.session.userStatus

		response.status(500).render("statuscode-500.hbs", userStatus)
	})

	return router

}