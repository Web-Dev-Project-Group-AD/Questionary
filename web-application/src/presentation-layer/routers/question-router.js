const express = require('express')

module.exports = ({ QuestionManager, SessionAuthenticator }) => {

    const router = express.Router()

    router.get("/new-post", SessionAuthenticator.authenticateUser, (request, response) => {
        
        const userStatus = request.session.userStatus

        response.render("questions-new-post.hbs")
    })

    router.post("/new-post", SessionAuthenticator.authenticateUser, (request, response) => {

        const userStatus = request.session.userStatus
        const author = request.session.userStatus.username
        const { category, question, description } = request.body
        const questionObject = { author, category, question, description }

        QuestionManager.createQuestion(questionObject
        ).then(createdQuestionObject => {

            response.redirect("/by-user/" + author)

        }).catch(errors => {
            // TODO: More complex error handling
            console.log(errors)
            response.render("questions-new-post.hbs", {userStatus, questionObject, errors})
        })
    })

    router.get("/unanswered", (request, response) => {
        QuestionManager.getAllUnansweredQuestions(
        ).then(questions => {
            response.render("questions.hbs", questions)
        }).catch(errors => {
            response.render("statuscode-500.hbs")
        })
    })

    router.get("/answered", (request, response) => {
        QuestionManager.getAllAnsweredQuestions(
        ).then(questions => {
            response.render("questions.hbs", questions)
        }).catch(errors => {
            response.render("statuscode-500.hbs")
        })
    })

    router.get('/by-user/:username'), (request, response) => {
        const username = request.params.username

        // TODO: fetch list of questions by username

        response.render("questions.hbs", questions)
    }

    router.get("/by-question-id/:questionid", (request, response) => {

        // TODO: fetch single question

        response.render("questions-show-one.hbs", question)
    })

    router.post("/by-question-id/:questionid", (request, response) => {
        const questionId = request.params.questionid

        // TODO: validate
        // TODO: post to database 

        response.redirect('/by-question-id/:questionid')
    })

    router.post("/by-question-id/:questionid/answer", (request, response) => {

        // TODO: validate
        // TODO: post answer to database
        // TODO: render question and answer together

        response.render("questions-show-one.hbs", { question, answer })
    })

    return router
}