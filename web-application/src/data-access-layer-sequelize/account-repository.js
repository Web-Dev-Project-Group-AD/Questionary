
//TODO: Move constants to separate file and use dependency injection

const ERROR_MSG_SIGN_UP_INPUT = "Incorrect email or password."
const ERROR_MSG_DATABASE_GENERAL = "Database error."
const ERROR_MSG_CREATE_UNIQUE_USERNAME = "Username is already taken."
const ERROR_MSG_CREATE_UNIQUE_EMAIL = "Email is already taken."

const SEQUELIZE_ERROR_UNIQUE_USERNAME = "username must be unique"
const SEQUELIZE_ERROR_UNIQUE_EMAIL = "email must be unique"


module.exports = ({ AccountModel }) => {

    return {

        createAccount(account) {
            return new Promise((resolve, reject) => {
                AccountModel.create({
                    username: account.username,
                    email: account.email,
                    password: account.password
                }).then(result => {
                    resolve(result.id)
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
        },

        createThirdPartyAccount(account) {
            return new Promise((resolve, reject) => {
                AccountModel.create({
                    username: account.username,
                    email: account.email,
                    password: "-"
                }).then(result => {
                    resolve(result.id)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL) 
                })
            })   
        },

        getAccountByUsername(username) {
            return new Promise((resolve, reject) => {
                AccountModel.findOne({
                    raw: true,
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
                    raw: true,
                    where: { email: email }
                }).then(account => {
                    console.log(account)
                    resolve(account)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        getAllAccounts() {
            return new Promise((resolve, reject) => {
                AccountModel.findAll({
                    raw: true
                }).then(accounts => {
                    resolve(accounts)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        updatePassword(id, password) {
            return new Promise((resolve, reject) => {
                AccountModel.update({
                    password: password
                }, {
                    where: {
                        id: id
                    }
                }).then(result => {
                    resolve(result.id)
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        },

        deleteAccountById(id) {
            return new Promise((resolve, reject) => {
                AccountModel.destroy({
                    where: {
                        id: id
                    }
                }).then(() => {
                    resolve()
                }).catch(error => {
                    console.log(error)
                    reject(ERROR_MSG_DATABASE_GENERAL)
                })
            })
        }
    }
}