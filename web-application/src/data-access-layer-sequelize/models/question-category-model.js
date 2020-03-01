sequelize = require('sequelize')

module.exports = ({}) => sequelize.define('QuestionCategory', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
    }
})