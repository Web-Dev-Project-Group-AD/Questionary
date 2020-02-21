const Sequelize = require('sequelize')

module.exports = function ({sequelize}) {

    const AccountModel = sequelize.define('account', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: Sequelize.TEXT,
        password: Sequelize.TEXT
        /*,
        email: Sequelize.TEXT,
        isAdmin: Sequelize.BOOLEAN,
        */
    })
    
    sequelize.sync({
        force: true
    }).then(() => {
        console.log(`Database & tables created!`)
    })

    return {

        /*
			  Retrieves all accounts ordered by username.
			  Possible errors: databaseError
			  Success value: The fetched accounts in an array.
		*/
        getAllAccounts() {
            return new Promise((resolve, reject) => {
                AccountModel.findAll(
                ).then(account => {
                    resolve(account)
                }).catch(error => {
                    console.log(error)
                    reject("db_error")
                })
            })
        },

        /*
			Retrieves the account with the given username.
			Possible errors: databaseError
			Success value: The fetched account, or null if no account has that username.
		*/
        getAccountByUsername(username) {
            return new Promise((resolve, reject) => {
                AccountModel.findOne({
                    where: { username: username }
                }).then(account => {
                    resolve(account)
                }).catch(error => {
                    console.log(error)
                    reject("db_error")
                })
            })
        },

        /*
			Creates a new account.
			account: {username: "The username", password: "The password"}
			Possible errors: databaseError, usernameTaken
			Success value: The id of the new account.
		*/
        createAccount(account) {
            return new Promise((resolve, reject) => {
                AccountModel.create({
                    username: account.username,
                    password: account.password
                }).then(account => {
                    resolve(account)
                }).catch(error => {
                    console.log(error)
                    reject("db_error")
                })
            })
        }

    }
}

// Sequelize example functions

/*
AccountModel.findById(accountId).then(function (databaseAccount) { }).catch(function (error) { })


AccountModel.findAll({
    where: { username: accountName }
}).then(function (databaseAccounts) { }).catch(function (error) { })

AccountModel.update({
    username: newUsername
}, {
    where: { id: accountId }
}).then(function (updatedAccounts) { }).catch(function (error) { })

AccountModel.destroy({
    where: { username: accountName }
}).then(function () { }).catch(function (error) { })
*/