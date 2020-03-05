const Sequelize = require("sequelize")

module.exports = ({ sequelize, AccountModel, QuestionModel }) => {

    AnswerModel = sequelize.define("AnswerModel", {
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
                key: "username",
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        questionId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: QuestionModel,
                key: "id",
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        content: {
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

    AnswerModel.hasOne(QuestionModel, { foreignKey: "id", sourceKey: "questionId", constraints: false });
    AnswerModel.belongsTo(QuestionModel, { foreignKey: "id" });

      

    return AnswerModel
}