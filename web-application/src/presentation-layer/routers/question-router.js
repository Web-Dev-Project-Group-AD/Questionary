const express = require('express')

router.get("/questions/new-post", function (request, response) {

    response.render("questions-new-post.hbs")
})

router.post("/questions/new-post", function (request, response) {

    // TODO: validate
    // TODO:  post to database

    // const username = request.sessions.username
    res.redirect('questions/by-user/:username');
})

router.get('questions/by-user/:username'), function (request, response) {
    const username = request.params.username

    // TODO: fetch list of questions by username

    response.render("questions.hbs", questions)
}

router.get("/questions/unanswered", function (request, response) {

    // TODO: fetch list of unanswered questions

    response.render("questions.hbs", questions)
})

router.get("/questions/answered", function (request, response) {

    // TODO: fetch list of answered questions

    response.render("questions.hbs", questions)
})


router.get("/questions/by-question-id/:questionid", function (request, response) {

    // TODO: fetch single question

    response.render("questions-show-one.hbs", questions)
})

router.post("/questions/by-question-id/:questionid", function (request, response) {
    const questionId = request.params.questionid

    // TODO: validate
    // TODO: post to database 


    response.redirect('/questions/by-question-id/:questionid')
})