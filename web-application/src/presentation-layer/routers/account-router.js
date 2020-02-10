const express = require('express')

const accountManager = require('../../business-logic-layer/account-manager')


const router = express.Router()

router.get("/sign-up", function (request, response) {
	response.render("accounts-sign-up.hbs")
})

router.post("/sign-up", function (request, response) {

	const { username, password, passwordRepeated } = request.body
	const account = { username, password, passwordRepeated }
	const plainTextPassword = password

	accountManager.createAccount(account, function (errors) {
		if (errors.length > 0) {
			// TODO: Handle errors
			response.render("error.hbs")
		} else {
			account.password = plainTextPassword
			accountManager.signInAccount(account, function (error) {
				if (error != null) {
					// TODO: Handle errors
					response.render("error.hbs")
				} else {
					const signedIn = true
					const isAdmin = false
					//const isAdmin = (user.userType == 'admin' ? true : false)
					const userStatus = { signedIn, isAdmin, username }
					request.session.userStatus = userStatus
					console.log(username, " signed in")

					response.render("home.hbs")
				}
			})
		}
	})
})

router.get("/sign-in", function (request, response) {
	response.render("accounts-sign-in.hbs")
})



router.get("/", function (request, response) {
	accountManager.getAllAccounts(function (errors, accounts) {
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

module.exports = router