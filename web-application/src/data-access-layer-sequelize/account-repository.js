
//TODO: Move constants to separate file and use dependency injection

const ERROR_MSG_SIGN_UP_INPUT = "Incorrect email or password."
const ERROR_MSG_DATABASE_GENERAL = "Database error."
const ERROR_MSG_CREATE_UNIQUE_USERNAME = "Username is already taken."
const ERROR_MSG_CREATE_UNIQUE_EMAIL = "Email is already taken."

const SEQUELIZE_ERROR_UNIQUE_USERNAME = "username must be unique"
const SEQUELIZE_ERROR_UNIQUE_EMAIL = "email must be unique"


module.exports = function ({ AccountModel }) {

    return {

        getAllAccounts() {
            return new Promise((resolve, reject) => {
                AccountModel.findAll(
                ).then(account => {
                    resolve(account)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getAccountByUsername(username) {
            return new Promise((resolve, reject) => {
                AccountModel.findOne({
                    where: { username: username }
                }).then(account => {
                    resolve(account)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getAccountByEmail(email) {
            return new Promise((resolve, reject) => {
                AccountModel.findOne({
                    where: { email: email }
                }).then(account => {
                    resolve(account)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        createAccount(account) {
            return new Promise((resolve, reject) => {
                AccountModel.create({
                    username: account.username,
                    email: account.email,
                    password: account.password
                }).then(account => {
                    resolve(account)
                }).catch(errorList => {
                    const errors = []

                    for (error of errorList.errors) {
                        if (error.message == SEQUELIZE_ERROR_UNIQUE_USERNAME) {
                            errors.push(ERROR_MSG_CREATE_UNIQUE_USERNAME)
                        } else if (error.message == SEQUELIZE_ERROR_UNIQUE_EMAIL) {
                            errors.push(ERROR_MSG_CREATE_UNIQUE_EMAIL)
                        } else {
                            errors.push(ERROR_MSG_DATABASE_GENERAL)
                        }
                    }
                    reject(errors)
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