sequelize = require('sequelize')

module.exports = ({}) => sequelize.define('Answer', {
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
            key: 'username'
        }
    },
    questionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Question,
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