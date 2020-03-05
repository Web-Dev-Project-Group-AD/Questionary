const Sequelize = require('sequelize')

const POSTGRES_DB = "postgres"
const POSTGRES_USER = "admin"
const POSTGRES_PASSWORD = "password1"
const POSTGRES_HOST = "postgres"

const sequelize = new Sequelize(

    POSTGRES_DB,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    {
        dialect: 'postgres',
        host: POSTGRES_HOST
    },
    console.log("sequelize-setup!")
)

module.exports = () => {
    return sequelize
}