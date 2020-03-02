const Sequelize = require('sequelize')

module.exports = ({sequelize}) => sequelize.define('QuestionCategoryModel', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true
    }
})