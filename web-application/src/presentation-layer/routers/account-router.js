const express = require('express')



module.exports = function ({ accountManager }) {
	// Name all the dependencies in the curly brackets. 
	//TODO it could be more dependecies 


	const router = express.Router()

	router.get("/sign-up", function (request, response) {
		response.render("accounts-sign-up.hbs")
	})

	router.post("/sign-up", function (request, response) {

		const { username, password, passwordRepeated } = request.body
		const account = { username, password, passwordRepeated }

		accountManager.createAccount(account, function (errors) {
			if (0 < errors.length) {
				console.log(errors)
				// TODO: Handle errors
			} else {
				response.render("home.hbs")
			}
		})

	})

	router.get("/sign-in", function (request, response) {
		response.render("accounts-sign-in.hbs")
	})



	router.get("/", function (request, response) {

		//const loggedInAccounts = request.session.account

		accountManager.getAllAccounts(function (errors, accounts) {

			console.log(errors, accounts)
			const model = {
				errors: errors,
				accounts: accounts
			}
			response.render("accounts-list-all.hbs", model)
		})
	})

	router.get('/:username', function (request, response) {

		const username = request.params.username

		accountManager.getAccountByUsername(username, function (errors, account) {
			const model = {
				errors: errors,
				account: account
			}
			response.render("accounts-show-one.hbs", model)
		})

	})

	return router

}