
const Sequelize = require('sequelize')

//const sequelize = new Sequelize('postgres:postgres-database')


const sequelize = new Sequelize(
    /*process.env.POSTGRES_DB, 
    process.env.POSTGRES_USER, 
    process.env.POSTGRES_PASSWORD,
    */
    "postgres",
    "admin",
    "password",
    {
        dialect: 'postgres',
        host: "192.168.99.100" //process.env.POSTGRES_HOST
    },
)

const Account = sequelize.define('account', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: Sequelize.TEXT,
    password: Sequelize.TEXT
})

sequelize.sync({ force: true })
    .then(() => {
        console.log(`Database & tables created!`)
    })


module.exports = function () {

    return {

        /*
			  Retrieves all accounts ordered by username.
			  Possible errors: databaseError
			  Success value: The fetched accounts in an array.
		*/
        getAllAccounts() {
            return new Promise((resolve, reject) => {
                Account.findAll(
                ).then(account => {
                    resolve(account)
                }).catch(error => {
                    console.log(error)
                    reject("database error")
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
                Account.findOne({
                    where: { username: username }
                }).then(account => {
                    resolve(account)
                }).catch(error => {
                    console.log(error)
                    reject("database error")
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
            console.log("hello")
            return new Promise((resolve, reject) => {
                Account.create({
                    username: account.username,
                    password: account.password
                }).then(account => {
                    resolve(account)
                }).catch(error => {
                    console.log(error)
                    reject("database error")
                })
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