sequelize = require('sequelize')

module.exports = ({}) => sequelize.define('Question', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: Sequelize.TEXT,
        allowNull: false,
        references: {
            model: Account,
            key: 'id'
        }
    },
    category: {
        type: Sequelize.TEXT,
        allowNull: false,
        references: {
            model: QuestionCategory,
            key: 'category'
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