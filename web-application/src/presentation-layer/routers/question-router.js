const express = require('express')

module.exports = function ({  QuestionManager }) {

    const router = express.Router()

    router.get("/new-post", function (request, response) {

        response.render("questions-new-post.hbs")
    })

    router.post("/new-post", function (request, response) {

        const author = request.session.userStatus.username
        const { category, question, description } = request.body
        const questionObject = { author, category, question, description }

        QuestionManager.createQuestion(questionObject
        ).then(createdQuestionObject => {

            response.redirect("/by-user/:author")

        }).catch(errors => {
            // TODO: More complex error handling
            console.log(errors)
            response.render("questions-new-post.hbs", questionObject, errors)
        })
    })

    router.get("/unanswered", function (request, response) {
        QuestionManager.getAllUnAnsweredQuestions(
        ).then(questions => {
            response.render("questions.hbs", questions)
        }).catch(errors => {
            response.render("error.hbs")
        })
    })

    router.get("/answered", function (request, response) {
        QuestionManager.getAllAnsweredQuestions(
        ).then(answeredQuestions => {
            response.render("questions.hbs", answeredQuestions)
        }).catch(errors => {
            response.render("error.hbs")
        })
    })

    router.get('/by-user/:username'), function (request, response) {
        const username = request.params.username

        // TODO: fetch list of questions by username

        response.render("questions.hbs", questions)
    }

    router.get("/by-question-id/:questionid", function (request, response) {

        // TODO: fetch single question

        response.render("questions-show-one.hbs", question)
    })

    router.post("/by-question-id/:questionid", function (request, response) {
        const questionId = request.params.questionid

        // TODO: validate
        // TODO: post to database 

        response.redirect('/by-question-id/:questionid')
    })

    router.post("/by-question-id/:questionid/answer", function (request, response) {

        // TODO: validate
        // TODO: post answer to database
        // TODO: render question and answer together

        response.render("questions-show-one.hbs", question, answer)
    })

    return router
}