const express = require('express')

const ERROR_MSG_DATABASE_GENERAL = "Database error."


module.exports = ({ QuestionManager, SessionAuthenticator }) => {

    const router = express.Router()

    router.get("/new-post", SessionAuthenticator.authenticateUser, (request, response) => {

        const userStatus = request.session.userStatus

        response.render("questions-new-post.hbs", { userStatus })
    })

    router.post("/new-post", SessionAuthenticator.authenticateUser, (request, response) => {

        const userStatus = request.session.userStatus
        const author = request.session.userStatus.username
        const { category, title, description } = request.body
        const question = { author, category, title, description }

        QuestionManager.createQuestion(question
        ).then(createdQuestion => {

            response.redirect("/by-user/" + author)

        }).catch(validationErrors => {
            console.log(validationErrors)
            if (validationErrors.includes(ERROR_MSG_DATABASE_GENERAL)) {
                response.status(500).render("statuscode-500.hbs", { userStatus })
            } else {
                response.render("questions-new-post.hbs", { userStatus, question, validationErrors })
            }
        })
    })

    router.get("/unanswered", (request, response) => {

        const userStatus = request.session.userStatus

        QuestionManager.getAllUnansweredQuestions(
        ).then(questions => {
            response.render("questions.hbs", { userStatus, questions })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/answered", (request, response) => {

        const userStatus = request.session.userStatus

        QuestionManager.getAllQuestionsWithAnswers(
        ).then(questions => {
            response.render("questions.hbs", { userStatus, questions })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get('/by-user/:author'), (request, response) => {

        const userStatus = request.session.userStatus
        const author = request.params.author

        QuestionManager.getQuestionsByAuthor(author
        ).then(questions => {
            response.render("questions.hbs", { userStatus, questions })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    }

    router.get("/by-question-id/:questionid", (request, response) => {
        const id = request.params.questionid
        const userStatus = request.session.userStatus

        if (request.body) {
            const {title, description, author}  = request.body
            const question = {id, title, description, author}
            response.render("questions-show-one.hbs", { userStatus, question })
        } else {
            QuestionManager.getQuestionById(id
            ).then(question => {
                response.render("questions-show-one.hbs", { userStatus, question })
            }).catch(error => {
                console.log(error)
                response.status(500).render("statuscode-500.hbs", { userStatus })
            })
        }
    })

    router.post("/by-question-id/:questionid", (request, response) => {

        const id = request.params.questionid
        const {title, description, author}  = request.body
        const answerContent = request.body.content
        const question = {id, title, description, author}

        QuestionManager.createAnswer(answerContent
        ).then(createdAnswer => {
            answers = [createdAnswer]
            response.render("questions-show-one.hbs", { userStatus, question, answers })
        }).catch(validationErrors => {
            console.log(validationErrors)
            if (validationErrors.includes(ERROR_MSG_DATABASE_GENERAL)) {
                response.status(500).render("statuscode-500.hbs", { userStatus })
            } else {
                response.render("questions-new-answer.hbs", { validationErrors, userStatus, question })

            } 
        })
    })

    return router
}