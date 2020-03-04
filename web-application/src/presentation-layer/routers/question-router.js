const express = require('express')

module.exports = ({ QuestionManager, SessionAuthenticator }) => {

    const router = express.Router()

    router.get("/new-post", SessionAuthenticator.authenticateUser, (request, response) => {

        const userStatus = request.session.userStatus

        response.render("questions-new-post.hbs", { userStatus })
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
            response.render("questions-new-post.hbs", { userStatus, questionObject, errors })
        })
    })

    router.get("/unanswered", (request, response) => {

        const userStatus = request.session.userStatus

        QuestionManager.getAllUnansweredQuestions(
        ).then(questions => {
            console.log(questions)
            response.render("questions.hbs", { userStatus, questions })
        }).catch(errors => {
            console.log(errors)
            response.render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/answered", (request, response) => {

        const userStatus = request.session.userStatus
        QuestionManager.getAllAnsweredQuestions(
        ).then(questions => {
            console.log(questions)
            response.render("questions.hbs", { userStatus, questions })
        }).catch(errors => {
            console.log(errors)
            response.render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get('/by-user/:author'), (request, response) => {

        const userStatus = request.session.userStatus
        const author = request.params.author

        QuestionManager.getQuestionsByAuthor(author
        ).then(questions => {
            response.render("questions.hbs", { userStatus, questions })
        }).catch(errors => {
            response.render("statuscode-500.hbs", { userStatus })
        })
    }

    router.get("/by-question-id/:questionid", (request, response) => {

        const userStatus = request.session.userStatus

        // TODO: fetch single question

        response.render("questions-show-one.hbs", { userStatus, question })
    })

    router.post("/by-question-id/:questionid", (request, response) => {

        const questionId = request.params.questionid

        // TODO: validate
        // TODO: post to database 

        response.redirect('/by-question-id/:questionid')
    })

    router.post("/by-question-id/:questionid/answer", (request, response) => {

        const userStatus = request.session.userStatus

        // TODO: validate
        // TODO: post answer to database
        // TODO: render question and answer together

        response.render("questions-show-one.hbs", { userStatus, question, answer })
    })

    return router
}