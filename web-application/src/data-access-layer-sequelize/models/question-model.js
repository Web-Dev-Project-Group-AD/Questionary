const Sequelize = require('sequelize')

module.exports = ({sequelize, AccountModel, QuestionCategoryModel}) => sequelize.define('QuestionModel', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: Sequelize.TEXT,
        allowNull: false,
        references: {
            model: AccountModel,
            key: 'username'
        }
    },
    category: {
        type: Sequelize.TEXT,
        allowNull: false,
        references: {
            model: QuestionCategoryModel,
            key: 'name'
        }
    },
    question: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    description: Sequelize.TEXT,
    isAnswered: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    lastEdited: {
        type: Sequelize.DATE,
    }
})