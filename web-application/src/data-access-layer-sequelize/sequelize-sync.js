
module.exports = ({ sequelize }) => {

    sequelize.sync({
        force: true
    }).then(() => {
        console.log("Database & tables created!")
    }).catch(error => {
        console.log(error)
    })
    
}