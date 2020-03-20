const express = require("express")

module.exports = ({}) => {

	const router = express.Router()

	router.get("/", (request, response) => {

		response.redirect("/questions/answered")
	})
	
	return router
}