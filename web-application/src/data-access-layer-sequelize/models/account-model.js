const Sequelize = require('sequelize')

module.exports = ({sequelize}) => sequelize.define('AccountModel', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    thirdParty: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
})