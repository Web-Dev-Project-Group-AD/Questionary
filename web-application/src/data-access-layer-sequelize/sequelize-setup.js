const Sequelize = require('sequelize')

const POSTGRES_DB = "postgres"
const POSTGRES_USER = "admin"
const POSTGRES_PASSWORD = "password1"
const POSTGRES_HOST = "192.168.99.100"


module.exports = () => {

    return sequelize = new Sequelize(
        /*process.env.POSTGRES_DB, 
        process.env.POSTGRES_USER, 
        process.env.POSTGRES_PASSWORD,
        */
        POSTGRES_DB,
        POSTGRES_USER,
        POSTGRES_PASSWORD,
        {
            dialect: 'postgres',
            host: POSTGRES_HOST //process.env.POSTGRES_HOST
        },
    )
}