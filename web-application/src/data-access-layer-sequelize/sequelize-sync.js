
module.exports = ({ sequelize, AccountModel }) => {

    sequelize.sync({
        force: true
    }).then(() => {
        console.log("Database & tables created!")
        return AccountModel.create({
            username: "Deleted user",
            email: "-",
            password: "-"
        })
    }).then(result => {
        console.log("Delete user account created.")
    }).catch(error => {
        console.log(error)
    })
    
    
}