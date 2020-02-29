const express = require('express')

module.exports = function ({ }) {

    const router = express.Router()

    router.get("/new-post", function (request, response) {

        response.render("questions-new-post.hbs")
    })

    router.post("/new-post", function (request, response) {

        // TODO: validate
        // TODO:  post to database

        // const username = request.sessions.username
        res.redirect('questions/by-user/:username');
    })

    router.get("/unanswered", function (request, response) {

        // TODO: fetch list of unanswered questions

        response.render("questions.hbs", questions)
    })

    router.get("/answered", function (request, response) {

        // TODO: fetch list of answered questions
        // TODO: fetch list of answers matching questions
        // TODO: create new list containing both
        // TODO: render questions and answers

        response.render("questions.hbs", questions)
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