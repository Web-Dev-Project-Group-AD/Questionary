const Sequelize = require('sequelize')

module.exports = ({ sequelize, AccountModel, QuestionCategoryModel }) => {
    QuestionModel = sequelize.define('QuestionModel', {

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
                key: 'username',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        category: {
            type: Sequelize.TEXT,
            allowNull: false,
            references: {
                model: QuestionCategoryModel,
                key: 'name',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        title: {
            type: Sequelize.TEXT,
            allowNull: false,
            unique: true
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


    return QuestionModel
}