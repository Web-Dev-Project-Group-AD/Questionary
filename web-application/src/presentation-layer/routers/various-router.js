const express = require("express")

module.exports = ({ SearchManager }) => {

	const router = express.Router()

	router.get("/", (request, response) => {

		response.redirect("/questions/answered")
	})

	router.get("/search", (request, response) => {
		const userStatus = request.session.userStatus
		response.render("search.hbs", { userStatus })
	})

	router.get("/search-results", (request, response) => {
		
		const userStatus = request.session.userStatus
		const searchQuery = request.query.searchQuery

		SearchManager.searchQuestions(searchQuery
		).then(questions => {
			response.render("questions.hbs", { userStatus, questions })
		}).catch(error => {
			console.log(error)
			response.statusCode(500).render("500.hbs", { userStatus })
		})
	})
	

	return router

}