const express = require("express")

const ERROR_MSG_DATABASE_GENERAL = "Database error."


module.exports = ({ QuestionManager, SessionAuthenticator }) => {

    const router = express.Router()

    router.get("/new-post", SessionAuthenticator.authenticateUser, (request, response) => {

        const userStatus = request.session.userStatus

        QuestionManager.getAllCategories(
        ).then(categories => {
            response.render("questions-new-post.hbs", { userStatus, categories })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.post("/new-post", SessionAuthenticator.authenticateUser, (request, response) => {

        const userStatus = request.session.userStatus
        const author = request.session.userStatus.username
        const {title, description } = request.body
        var category = (request.body.optionCategories && !request.body.customCategory) ? 
            request.body.optionCategories : request.body.customCategory
      
        var question = { author, category, title, description }
        
        QuestionManager.createQuestion(question
        ).then(questionId => {
            response.redirect("/questions/by-user/" + author)
        }).catch(validationErrors => {
            console.log(validationErrors)
            if (validationErrors.includes(ERROR_MSG_DATABASE_GENERAL)) {
                response.status(500).render("statuscode-500.hbs", { userStatus })
            } else {
                QuestionManager.getAllCategories(
                ).then(categories => {
                    question.customCategory = request.body.customCategory
                    response.render("questions-new-post.hbs", { userStatus, question, validationErrors, categories })
                })
            }
        })
    })

    router.get("/unanswered", (request, response) => {

        const userStatus = request.session.userStatus
        isAnswered = false

        QuestionManager.getAllUnansweredQuestions(
        ).then(questions => {
            const categories = []
            for(question of questions) {
                if (!categories.includes(question.category)) {
                    const category = {name: question.category}
                    categories.push(category)
                }
            }
            response.render("questions.hbs", { userStatus, questions, categories, isAnswered })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/answered", (request, response) => {

        const userStatus = request.session.userStatus
        const isAnswered = true

        QuestionManager.getAllQuestionsWithAnswers(
        ).then(questions => {
            const categories = []
            for(question of questions) {
                if (!categories.includes(question.category)) {
                    const category = {name: question.category}
                    categories.push(category)
                }
            }
            response.render("questions.hbs", { userStatus, questions, categories, isAnswered })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/by-category/:category/:isAnswered", (request, response) => {

        const userStatus = request.session.userStatus
        const category = request.params.category
        var categories = []

        const isAnswered = (request.params.isAnswered == "answered")

        QuestionManager.getAllCategories(
        ).then(fetchedCategories => {
            categories = fetchedCategories
            return QuestionManager.getQuestionsByCategory(category, isAnswered)
        }).then(questions => {
            response.render("questions.hbs", { userStatus, questions, categories, isAnswered })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/by-user/:author", (request, response) => {

        const userStatus = request.session.userStatus
        const author = request.params.author
        var categories = []

        QuestionManager.getAllCategories(
        ).then(fetchedCategories => {
            categories = fetchedCategories
            return QuestionManager.getQuestionsByAuthor(author)
        }).then(questions => {
            response.render("questions.hbs", { userStatus, questions, categories })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/by-id/:questionid", (request, response) => {

        const id = request.params.questionid
        const userStatus = request.session.userStatus

        QuestionManager.getQuestionById(id
        ).then(question => {
            response.render("questions.hbs", { userStatus, question })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/by-id/:questionid/new-answer", (request, response) => {

        const userStatus = request.session.userStatus
        const id = request.params.questionid

        if (request.query) {
            const { title, description, author } = request.query
            const question = { id, title, description, author }
            return response.render("questions-new-answer.hbs", { userStatus, question })
        } else {
            return QuestionManager.getQuestionById(id
            ).then(question => {
                response.render("questions-new-answer.hbs", { userStatus, question })
            }).catch(error => {
                console.log(error)
                response.status(500).render("statuscode-500.hbs", { userStatus })
            })
        }
    })

    router.post("/by-id/:questionid/new-answer", (request, response) => {

        const userStatus = request.session.userStatus
        var question = { 
            id: request.params.questionid, 
            title: request.body.questionTitle, 
            description: request.body.questionDescription, 
            author: request.body.questionAuthor
        }
        const answer = { 
            author: userStatus.username, 
            questionId: request.params.questionid, 
            content: request.body.content 
        }
        QuestionManager.createAnswer(answer
        ).then(answerId => {
            answers = [answer]
            question.answers = answers
            const questions = [question]
            response.render("questions.hbs", { userStatus, questions })
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