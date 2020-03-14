const express = require("express")

const ERROR_MSG_DATABASE_GENERAL = "Database error."


module.exports = ({ QuestionManager, SessionAuthorizer }) => {

    const router = express.Router()

    router.get("/new-post", SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus

        QuestionManager.getAllCategories(
        ).then(categories => {
            response.render("questions-new-post.hbs", { userStatus, categories })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.post("/new-post", SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        const author = request.session.userStatus.username
        const {title, description } = request.body
        var category = (request.body.optionCategories && !request.body.customCategory) ? 
            request.body.optionCategories : request.body.customCategory
      
        var question = { author, category, title, description }
        
        QuestionManager.createQuestion(question
        ).then(questionId => {
            response.redirect("/questions/by-id/" + questionId)
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

    router.get("/by-id/:questionId", (request, response) => {

        const id = request.params.questionId
        const userStatus = request.session.userStatus

        QuestionManager.getQuestionById(id
        ).then(questions => {
            response.render("questions.hbs", { userStatus, questions })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/by-user/:author", (request, response) => {

        const userStatus = request.session.userStatus
        const author = request.params.author
        var categories = []

        QuestionManager.getQuestionsByAuthor(author
        ).then(questions => {
            response.render("questions.hbs", { userStatus, questions, categories })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/by-answer-author/:author", (request, response) => {

        const userStatus = request.session.userStatus
        const author = request.params.author

        console.log("author: ", author)

        QuestionManager.getQuestionsByAnswerAuthor(author
        ).then(questions => {
            const categories = []
            for(question of questions) {
                if (!categories.includes(question.category)) {
                    categories.push(question.category)
                }
            }
            response.render("questions.hbs", { userStatus, questions, categories })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/unanswered", (request, response) => {

        const userStatus = request.session.userStatus
        const isAnswered = false

        QuestionManager.getAllUnansweredQuestions(
        ).then(questions => {
            const categories = []
            for(question of questions) {
                if (!categories.includes(question.category)) {
                    categories.push(question.category)
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
                    categories.push(question.category)
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
        const categories = []
        const isAnswered = (request.params.isAnswered == "answered")

        QuestionManager.getAllCategories(
        ).then(fetchedCategories => {
            for (fetchedCategory of fetchedCategories) {
                console.log(fetchedCategory)
                categories.push(fetchedCategory.name)
            }
            return QuestionManager.getQuestionsByCategory(category, isAnswered)
        }).then(questions => {
            response.render("questions.hbs", { userStatus, questions, categories, isAnswered })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/by-id/:questionId/edit", SessionAuthorizer.authorizeUser, (request, response) => {

        const id = request.params.questionId
        const userStatus = request.session.userStatus

        if (request.query && userStatus.username == request.query.author) {
            const { title, description, author } = request.query
            const question = { id, title, description, author }
            return response.render("questions-edit.hbs", { userStatus, question })
        } else {
            return QuestionManager.getQuestionById(id
            ).then(question => {
                if (question.author == userStatus.username) {
                    response.render("questions-edit.hbs", { userStatus, question })
                } else {
                    response.status(401).render("statuscode-401.hbs", { userStatus })
                }
            }).catch(error => {
                console.log(error)
                response.status(500).render("statuscode-500.hbs", { userStatus })
            })
        }
    })

    router.post("/by-id/:questionId/edit", SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        const question = { 
            author: userStatus.username,
            id: request.params.questionId, 
            title: request.body.questionTitle, 
            description: request.body.questionDescription
        }
       
        QuestionManager.updateQuestion(question
        ).then(questionId => {
            response.redirect("/questions/by-id/" + questionId)
        }).catch(validationErrors => {
            console.log(validationErrors)
            if (validationErrors.includes(ERROR_MSG_DATABASE_GENERAL)) {
                response.status(500).render("statuscode-500.hbs", { userStatus })
            } else {
                response.render("questions-edit.hbs", { validationErrors, userStatus, question })
            }
        })
    })

    router.post("/by-id/:questionId/delete", SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        const author = userStatus.username
        const id = request.params.questionId

        QuestionManager.deleteQuestionById(author, id
        ).then(() => {
            response.redirect("/questions/by-user/" + author)
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })


    router.get("/by-id/:questionId/new-answer", SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        const id = request.params.questionId

        if (request.query) {
            const question = { 
                id: id, 
                title: request.query.questionTitle, 
                description: request.query.questionDescription, 
                author: request.query.questionAuthor 
            }
            return response.render("questions-new-answer.hbs", { userStatus, question })
        } else {
            return QuestionManager.getQuestionById(id
            ).then(question => {
                if (question) {
                    response.render("questions-new-answer.hbs", { userStatus, question })
                } else {
                    response.status(404).render("statuscode-404.hbs", { userStatus })
                }
            }).catch(error => {
                console.log(error)
                response.status(500).render("statuscode-500.hbs", { userStatus })
            })
        }
    })

    router.post("/by-id/:questionId/new-answer", SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        var question = { 
            id: request.params.questionId, 
            title: request.body.questionTitle, 
            description: request.body.questionDescription, 
            author: request.body.questionAuthor
        }
        var answer = { 
            author: userStatus.username, 
            questionId: request.params.questionId, 
            content: request.body.content 
        }

        QuestionManager.createAnswer(answer
        ).then(answerId => {
            console.log("answerid: ", answerId)
            answer.id = answerId
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
            
    router.get("/by-id/:questionId/edit-answer/:answerId", SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        const questionId = request.params.questionId
        const answerId = request.params.answerId
        var question = null

        if (request.query) {
            const answer = { 
                id: answerId,
                author: userStatus.username, 
                content: request.query.content 
            }
            question = {
                id: questionId,
                title: request.query.questionTitle,
                description: request.query.questionDescription,
                author: request.query.questionAuthor,
                answer: answer
            }
            response.render("questions-edit-answer.hbs", { userStatus, question })
        } else {
            QuestionManager.getQuestionById(questionId
            ).then(returnedQuestion => {
                question = returnedQuestion
                return QuestionManager.getAnswerById(answerId)
            }).then(answer => {
                if (question && answer) {
                    question.answer = answer
                    response.render("questions-edit-answer.hbs", { userStatus, question })
                } else {
                    response.status(404).render("statuscode-404.hbs", { userStatus })
                }
            }).catch(error => {
                console.log(error)
                response.status(500).render("statuscode-500.hbs", { userStatus })
            })
        }
    })

    router.post("/by-id/:questionId/edit-answer/:answerId", SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        const answer = { 
            id: request.params.answerId,
            author: userStatus.username, 
            content: request.body.content
        }
        var question = { 
            id: request.params.questionId, 
            title: request.body.questionTitle, 
            description: request.body.questionDescription, 
            author: request.body.questionAuthor
        }

        QuestionManager.updateAnswer(answer
        ).then(answerId => {
            const answers = [answer]
            question.answers = answers
            const questions = [question]
            response.render("questions.hbs", { userStatus, questions })
        }).catch(validationErrors => {
            console.log(validationErrors)
            if (validationErrors.includes(ERROR_MSG_DATABASE_GENERAL)) {
                response.status(500).render("statuscode-500.hbs", { userStatus })
            } else {
                question.answer = answer
                response.render("questions-edit-answer.hbs", { validationErrors, userStatus, question })
            }
        })
    }) 

    router.post("/by-id/:questionId/delete-answer/:answerId", SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        const author = userStatus.username
        const answerId = request.params.answerId
        const questionId = request.params.questionId

        QuestionManager.deleteAnswerById(author, answerId
        ).then(() => {
            response.redirect("/questions/by-id/" + questionId)
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    return router
}