const express = require("express")

const ERROR_MSG_DATABASE_GENERAL = "Database error."

const CATEGORY_ANSWERED = "answered"
const CATEGORY_UNANSWERED = "unanswered"
const CATEGORY_ALL = "all"


module.exports = ({ QuestionManager, SearchManager, SessionAuthorizer, csrfProtection }) => {

    const router = express.Router()

    router.get("/new-post", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus

        QuestionManager.getAllCategories(
        ).then(categories => {
            response.render("questions-new-post.hbs", 
            { userStatus, categories, csrfToken: request.csrfToken() })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.post("/new-post", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {
        
        const category = (request.body.optionCategories && !request.body.customCategory) ? 
        request.body.optionCategories : request.body.customCategory

        const userStatus = request.session.userStatus
        var question = { 
            author: userStatus.username,
            category: category, 
            title: request.body.title, 
            description: request.body.description
        }
        
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
                    response.render("questions-new-post.hbs", 
                    { userStatus, question, validationErrors, categories, csrfToken: request.csrfToken() })
                })
            }
        })
    })

    router.get("/by-id/:questionId", csrfProtection, (request, response) => {

        const questionId = request.params.questionId
        const userStatus = request.session.userStatus
        const answerStatus = CATEGORY_ALL
    
        QuestionManager.getQuestionAnswered(questionId
        ).then(questions => {
            const categories = [questions[0].category]
            response.render("questions.hbs", 
            { userStatus, questions, categories, answerStatus, csrfToken: request.csrfToken() })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/by-user/:author", csrfProtection, (request, response) => {

        const userStatus = request.session.userStatus
        const author = request.params.author
        const answerStatus = CATEGORY_ALL

        QuestionManager.getQuestionsByAuthor(author
        ).then(questions => {
            const categories = []
            for(question of questions) {
                if (!categories.includes(question.category)) {
                    categories.push(question.category)
                }
            }
            response.render("questions.hbs", 
            { userStatus, questions, categories, answerStatus, csrfToken: request.csrfToken() })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/by-answer-author/:author", csrfProtection, (request, response) => {

        const userStatus = request.session.userStatus
        const author = request.params.author
        const answerStatus = CATEGORY_ANSWERED

        QuestionManager.getQuestionsByAnswerAuthor(author
        ).then(questions => {
            const categories = []
            for(question of questions) {
                if (!categories.includes(question.category)) {
                    categories.push(question.category)
                }
            }
            response.render("questions.hbs", 
            { userStatus, questions, categories, answerStatus, csrfToken: request.csrfToken() })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/:answerStatus", csrfProtection, (request, response) => {
        const userStatus = request.session.userStatus
        const answerStatus = request.params.answerStatus

        var questions = []
        if (answerStatus == CATEGORY_ALL) {
            questions = QuestionManager.getAll()
        } else if (answerStatus == CATEGORY_ANSWERED) {
            questions = QuestionManager.getAllAnswered()
        } else {
            questions = QuestionManager.getAllUnanswered()
        }
        questions.then(questions => {
            const categories = []
            for (question of questions) {
                if (!categories.includes(question.category)) {
                    categories.push(question.category)
                }
            }
            return response.render("questions.hbs", 
            { userStatus, questions, categories, answerStatus, csrfToken: request.csrfToken() })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
        
    })
    
    // router.get("/unanswered", csrfProtection, (request, response) => {

    //     const userStatus = request.session.userStatus
    //     const answerStatus = CATEGORY_UNANSWERED

    //     QuestionManager.getAllUnansweredQuestions(
    //     ).then(questions => {
    //         const categories = []
    //         for(question of questions) {
    //             if (!categories.includes(question.category)) {
    //                 categories.push(question.category)
    //             }
    //         }
    //         response.render("questions.hbs", 
    //         { userStatus, questions, categories, answerStatus, csrfToken: request.csrfToken() })
    //     }).catch(error => {
    //         console.log(error)
    //         response.status(500).render("statuscode-500.hbs", { userStatus })
    //     })
    // })

    // router.get("/answered", csrfProtection, (request, response) => {

    //     const userStatus = request.session.userStatus
    //     const answerStatus = CATEGORY_ANSWERED
        
    //     QuestionManager.getAllQuestionsWithAnswers(
    //     ).then(questions => {
    //         const categories = []
    //         for(question of questions) {
    //             if (!categories.includes(question.category)) {
    //                 categories.push(question.category)
    //             }
    //         }
    //         response.render("questions.hbs", 
    //         { userStatus, questions, categories, answerStatus, csrfToken: request.csrfToken() })
    //     }).catch(error => {
    //         console.log(error)
    //         response.status(500).render("statuscode-500.hbs", { userStatus })
    //     })
    // })

    router.get("/by-category/:category/:answerStatus", csrfProtection, (request, response) => {

        const userStatus = request.session.userStatus
        const category = request.params.category
        const answerStatus = request.params.answerStatus
        
        var questions = []

        if (answerStatus == CATEGORY_ALL) {
            questions = QuestionManager.getAllByCategory(category)
        } else if (answerStatus == CATEGORY_ANSWERED) {
            questions = QuestionManager.getAnsweredByCategory(category)
        } else {
            questions = QuestionManager.getUnansweredByCategory(category)
        }
        questions.then(questions => {
            const categories = []
            for (question of questions) {
                if (!categories.includes(question.category)) {
                    categories.push(question.category)
                }
            }
            response.render("questions.hbs", 
            { userStatus, questions, categories, answerStatus, csrfToken: request.csrfToken() })
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })
        
    
    //     QuestionManager.getCategoriesByAnswerStatus(answerStatus
    //     ).then(fetchedCategories => {
    //         for (fetchedCategory of fetchedCategories) {
    //             categories.push(fetchedCategory.name)
    //         }
    //         if (answerStatus == CATEGORY_ALL || answerStatus == CATEGORY_ANSWERED) {
    //             return QuestionManager.getQuestionsByCategory(category, isAnswered = true)
    //         } else {
    //             return QuestionManager.getQuestionsByCategory(category, isAnswered = false)
    //         }
    //     }).then(fetchedQuestions => {
    //         questions = fetchedQuestions
    //         if (answerStatus == CATEGORY_UNANSWERED) {
    //             return response.render("questions.hbs", 
    //             { userStatus, questions, categories, answerStatus, csrfToken: request.csrfToken() })
    //         } else {
    //             return QuestionManager.getQuestionsByCategory(category, isAnswered = false)
    //         }
    //     }).then(fetchedQuestions => {
    //         questions.push.apply(questions, fetchedQuestions)
    //         return response.render("questions.hbs", 
    //         { userStatus, questions, categories, answerStatus, csrfToken: request.csrfToken() })
    //     }).catch(error => {
    //         console.log("categories: ", error)
    //         response.status(500).render("statuscode-500.hbs", { userStatus })
    //     })
    // })
    

    router.get("/by-id/:questionId/edit",
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {

        const id = request.params.questionId
        const userStatus = request.session.userStatus

        if (request.query && userStatus.username == request.query.author) {
            const question = { 
                id: id, 
                title: request.query.title, 
                description: request.query.description, 
                author: request.query.description
            }

            return response.render("questions-edit.hbs", 
            { userStatus, question, csrfToken: request.csrfToken() })
        } else {
            return QuestionManager.getQuestionById(id
            ).then(question => {
                if (question.author == userStatus.username) {
                    response.render("questions-edit.hbs", 
                    { userStatus, question, csrfToken: request.csrfToken() })
                } else {
                    response.status(401).render("statuscode-401.hbs", { userStatus })
                }
            }).catch(error => {
                console.log(error)
                response.status(500).render("statuscode-500.hbs", { userStatus })
            })
        }
    })

    router.post("/by-id/:questionId/edit", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        const question = { 
            author: userStatus.username,
            id: request.params.questionId, 
            title: request.body.title, 
            description: request.body.description
        }
       
        QuestionManager.updateQuestion(question
        ).then(returnedId => {
            response.redirect("/questions/by-id/" + question.id)
        }).catch(validationErrors => {
            console.log(validationErrors)
            if (validationErrors.includes(ERROR_MSG_DATABASE_GENERAL)) {
                response.status(500).render("statuscode-500.hbs", { userStatus })
            } else {
                response.render("questions-edit.hbs", 
                { validationErrors, userStatus, question, csrfToken: request.csrfToken() })
            }
        })
    })

    router.post("/by-id/:questionId/delete", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        const author = userStatus.username
        const questionId = request.params.questionId

        QuestionManager.deleteQuestionById(author, questionId
        ).then(() => {
            response.redirect("/questions/by-user/" + author)
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })


    router.get("/by-id/:questionId/new-answer", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        const questionId = request.params.questionId

        if (request.query) {
            const question = { 
                id: questionId, 
                title: request.query.questionTitle, 
                description: request.query.questionDescription, 
                author: request.query.questionAuthor 
            }
            return response.render("questions-new-answer.hbs", 
            { userStatus, question, csrfToken: request.csrfToken() })
        } else {
            return QuestionManager.getQuestionById(questionId
            ).then(question => {
                if (question) {
                    response.render("questions-new-answer.hbs", 
                    { userStatus, question, csrfToken: request.csrfToken() })
                } else {
                    response.status(404).render("statuscode-404.hbs", { userStatus })
                }
            }).catch(error => {
                console.log(error)
                response.status(500).render("statuscode-500.hbs", { userStatus })
            })
        }
    })

    router.post("/by-id/:questionId/new-answer", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        const answerStatus = CATEGORY_ALL
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
            answer.id = answerId
            answers = [answer]
            question.answers = answers
            const questions = [question]
            response.render("questions.hbs", 
            { userStatus, questions, answerStatus, csrfToken: request.csrfToken() })
        }).catch(validationErrors => {
            console.log(validationErrors)
            if (validationErrors.includes(ERROR_MSG_DATABASE_GENERAL)) {
                response.status(500).render("statuscode-500.hbs", { userStatus })
            } else {
                response.render("questions-new-answer.hbs", 
                { validationErrors, userStatus, question, csrfToken: request.csrfToken() })
            }
        })
    })
            
    router.get("/edit-answer/:answerId", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        const questionId = request.query.questionId
        const answerId = request.params.answerId
        var question = null

		QuestionManager.getQuestionWithSingleAnswer(questionId, answerId
        ).then(fetchedQuestion => {
            question = fetchedQuestion
            if (question) {
                response.render("questions-edit-answer.hbs", 
                { userStatus, question, csrfToken: request.csrfToken() })
            } else {
                response.status(404).render("statuscode-404.hbs", { userStatus })
            }
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.post("/edit-answer/:answerId", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        const answerStatus = CATEGORY_ANSWERED
        const answer = { 
            id: request.params.answerId,
            author: userStatus.username, 
            questionId: request.body.questionId, 
            content: request.body.content 
        }
        var question = { 
            id: request.body.questionId, 
            title: request.body.questionTitle, 
            description: request.body.questionDescription, 
            author: request.body.questionAuthor
        }
        
        QuestionManager.updateAnswer(answer
        ).then(answerId => {
            const answers = [answer]
            question.answers = answers
            const questions = [question]

            response.render("questions.hbs", 
            { userStatus, questions, answerStatus, csrfToken: request.csrfToken() })

        }).catch(validationErrors => {
            console.log(validationErrors)
            if (validationErrors.includes(ERROR_MSG_DATABASE_GENERAL)) {
                response.status(500).render("statuscode-500.hbs", { userStatus })
            } else {
                question.answer = answer
                response.render("questions-edit-answer.hbs", 
                { validationErrors, userStatus, question, csrfToken: request.csrfToken() })
            }
        })
    }) 

    router.post("/delete-answer/:answerId", 
    csrfProtection, SessionAuthorizer.authorizeUser, (request, response) => {

        const userStatus = request.session.userStatus
        const author = userStatus.username
        const answerId = request.params.answerId

        QuestionManager.deleteAnswerById(author, answerId
        ).then(() => {
            response.redirect("/questions/by-answer-author/" + userStatus.username)
        }).catch(error => {
            console.log(error)
            response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/search-results", csrfProtection, (request, response) => {
		
		const userStatus = request.session.userStatus
		const searchQuery = request.query.searchQuery

		SearchManager.searchQuestions(searchQuery
		).then(questions => {

            const categories = []
            for(question of questions) {
                if (!categories.includes(question.category)) {
                    categories.push(question.category)
                }
            }

            response.render("questions.hbs", 
            { userStatus, categories, questions, answerStatus: CATEGORY_ALL, csrfToken: request.csrfToken() })
		}).catch(error => {
			console.log(error)
			response.statusCode(500).render("500.hbs", { userStatus })
		})
	})

    return router
}