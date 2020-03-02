const Sequelize = require('sequelize')

module.exports = ({sequelize, AccountModel, QuestionModel}) => sequelize.define('AnswerModel', {
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
    questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: QuestionModel,
            key: 'id'
        }
    },
    answer: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
    },
    lastEdited: {
        type: Sequelize.DATE,
    }
})