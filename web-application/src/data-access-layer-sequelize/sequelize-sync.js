module.exports = ({ sequelize }) => {

    console.log("sequelize-sync!")

    sequelize.sync({
        force: true
    }).then(() => {
        console.log("Database & tables created!")
    }).catch(error => {
        console.log("hello: ", error)
    })
}