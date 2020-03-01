module.exports = sequelize.define('account', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: Sequelize.TEXT,
    password: Sequelize.TEXT,
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})