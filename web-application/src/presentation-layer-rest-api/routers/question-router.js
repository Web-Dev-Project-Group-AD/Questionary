const express = require('express')

const ERROR_MSG_DATABASE_GENERAL = "Database error."


module.exports = ({ QuestionManager, SessionAuthorizer, csrfProtection }) => {

    const router = express.Router()

    const serverSecret = "175342C7638E1D173B45FCC2EC97E"

    /*router.get("/new-post", (request, response) => {
        console.log("get new Questions in question router")

        //const userStatus = request.session.userStatus

        const loggedInId = response.locals.id

        console.log("loggedInId:", loggedInId)

        QuestionManager.getAllCategories(
        ).then(categories => {
            console.log("createnewQuestion: ", categories)
            response.status(201).json().end()

            //response.render("questions-new-post.hbs", 
            //{ userStatus, categories, csrfToken: request.csrfToken() })
        }).catch(error => {
            console.log(error)
            //response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })*/

    router.post("/new-post", (request, response) => {
        console.log("newQuestion_start")
        let payload = null

        const authorizationHeader = request.get('authorization')
        const accessToken = authorizationHeader.substr("Bearer ".length)

        console.log("authorizationHeader", authorizationHeader)
        console.log("getAllAccounts_accessToken", accessToken)


        //TODO change it when file middleware is working
        /*try {

            payload = jwt.verify(accessToken, serverSecret)

        } catch (e) {
            // No access token provided or the access token was invalid.
            if (e.name == "TokenExpiredError") {
                response.status(401).json({
                    'status': '401',
                    'error': 'invalid_token',
                    'message': 'JWT expired'
                })
                return
            } else {
                response.status(401).json({
                    'status': '401',
                    'error': 'invalid_token',
                    'message': 'JWT is malformed or invalid'
                })
                return
            }
        }*/

        console.log("here iam ")

        const category = (request.body.optionCategories && !request.body.customCategory) ? request.body.optionCategories : request.body.customCategory

        var question = {
            author: request.body.author,
            category: request.body.category,
            title: request.body.title,
            description: request.body.description
        }

        console.log("newQuestion: ", question)

        QuestionManager.createQuestion(question
        ).then(questionId => {
            response.setHeader('Location', '/questions/by-id/' + questionId)
            console.log("createdQuestion")
            response.status(201).json({
                question: question,
                status: '201',
                message: 'Question created successfully'
            })
        }).catch(validationErrors => {
            console.log(validationErrors)
            if (validationErrors.includes(ERROR_MSG_DATABASE_GENERAL)) {
                console.log("createQuestion_getAllCategorie_if: ")
                response.status(500).json(errorMessage)
                return
            } else {
                QuestionManager.getAllCategories(
                ).then(categories => {
                    console.log("createQuestion_getAllCategorie_else: ")
                    question.customCategory = request.body.customCategory
                    //response.setHeader('Location', '/questions/by-id/' + questionId)
                    response.status(201).json().end()
                })
            }
        })
    })

    router.get("/by-id/:questionId", (request, response) => {

        const questionId = request.params.questionId
        //const userStatus = request.session.userStatus

        console.log("questionId: ", questionId)

        QuestionManager.getQuestionAnswered(questionId
        ).then(questions => {
            const categories = [questions[0].category]
            console.log("categories_inID: ", categories)
            //response.render("questions.hbs", 
            // { userStatus, questions, categories, csrfToken: request.csrfToken() })
        }).catch(error => {
            console.log("hier in error", error)
            //response.status(500).render("statuscode-500.hbs", { userStatus })
        })
    })

    router.get("/unanswered", (request, response) => {
        console.log("newQuestion_unanswered_start")
        let payload = null

        //const authorizationHeader = request.get('authorization')
        //const accessToken = authorizationHeader.substr("Bearer ".length)

        //console.log("authorizationHeader", authorizationHeader)
        //console.log("getAllAccounts_accessToken", accessToken)

        const isAnswered = false

        QuestionManager.getAllUnansweredQuestions(
        ).then(questions => {
            const categories = []
            for (question of questions) {
                if (!categories.includes(question.category)) {
                    categories.push(question.category)
                }
                console.log(question, "are created.")
            }

            response.setHeader('Location', '/questions/unanswered')
            response.status(200).json({
                questions: questions,
                status: '200',
                message: 'Questions are showing successfully'
            })
            //response.render("questions.hbs", 
            //{ userStatus, questions, categories, isAnswered, csrfToken: request.csrfToken() })
        }).catch(error => {
            console.log("validationErrors: ", validationErrors)
            if (validationErrors) {
                response.status(400).json(validationErrors)
                return
            } else {
                response.status(500).json(error).end()
                //return
            }
        })
    })

    return router

}