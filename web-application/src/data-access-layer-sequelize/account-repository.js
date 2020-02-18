
const Sequelize = require('sequelize')
//const sequelize = new Sequelize('postgres:postgres-database')

console.log(process.env)

const sequelize = new Sequelize(
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USER,
    process.env.POSTGRES_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres'
    },
  )

const Account = sequelize.define('account', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    username: Sequelize.TEXT,
    password: Sequelize.TEXT
})

module.exports = function () {

    return {



        /*
			  Retrieves all accounts ordered by username.
			  Possible errors: databaseError
			  Success value: The fetched accounts in an array.
		*/
        getAllAccounts: function (callback) {
            Account.findAll()
                .then(function (accounts) {
                    callback([], accounts)
                }).catch(function (error) {
                    callback(['databaseError'], null)
                })

        },

        /*
			Retrieves the account with the given username.
			Possible errors: databaseError
			Success value: The fetched account, or null if no account has that username.
		*/
        getAccountByUsername: function (account, callback) {
            Account.findOne({
                where: { username: account.username }
            }).then(function (account) {
                callback([], account)
            }).catch(function (error) {
                callback(['databaseError'], null)
            })

        },

        /*
			Creates a new account.
			account: {username: "The username", password: "The password"}
			Possible errors: databaseError, usernameTaken
			Success value: The id of the new account.
		*/
        createAccount: function (account, callback) {
            console.log(account)
            Account.create({
                username: account.username, password: account.password
            }).then(function (account) {
                callback([], account)
            }).catch(function (error) {
                console.log("OOOPS")
                console.log(error)
                callback(['databaseError'], null)
            })
        }

    }
}

// Example functions for accounts

/*
Account.findById(accountId).then(function (databaseAccount) { }).catch(function (error) { })


Account.findAll({
    where: { username: accountName }
}).then(function (databaseAccounts) { }).catch(function (error) { })

Account.update({
    username: newUsername
}, {
    where: { id: accountId }
}).then(function (updatedAccounts) { }).catch(function (error) { })

Account.destroy({
    where: { username: accountName }
}).then(function () { }).catch(function (error) { })
*/