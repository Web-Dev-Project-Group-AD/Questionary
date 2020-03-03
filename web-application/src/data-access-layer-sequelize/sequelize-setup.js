const Sequelize = require('sequelize')

const POSTGRES_DB = "postgres"
const POSTGRES_USER = "admin"
const POSTGRES_PASSWORD = "password1"
const POSTGRES_HOST = "postgres"


module.exports = ({}) => {

    sequelize = new Sequelize(

        POSTGRES_DB,
        POSTGRES_USER,
        POSTGRES_PASSWORD,
        {
            dialect: 'postgres',
            host: POSTGRES_HOST
        },
    )

    sequelize.sync({
        force: true
    }).then(() => {
        console.log(`Database & tables created!`)
    })

    return sequelize

}