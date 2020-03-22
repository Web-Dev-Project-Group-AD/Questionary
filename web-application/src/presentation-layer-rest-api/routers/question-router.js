const express = require('express')
const jwt = require("jsonwebtoken")

const ERROR_MSG_DATABASE_GENERAL = "Database error."


function authorizeRequest(request, response, next) {
  
    const authorizationHeader = request.get('authorization')
    const accessToken = authorizationHeader.substr("Bearer ".length)
    
    jwt.verify(accessToken, serverSecret
    ).then(payload => {
        next()
    }).catch(error => {
        response.status(401).end()
        return
    })
}


module.exports = ({ QuestionManager }) => {

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
        try {

            payload = jwt.verify(accessToken, serverSecret)

        } catch (e) {
            console.log("error: ", e)

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
        }

        var question = {
            author: request.body.author,
            category: request.body.category,
            title: request.body.title,
            description: request.body.description
        }

        console.log("newQuestion: ", question)

        QuestionManager.createQuestion(question
        ).then(questionId => {
            response.setHeader("Location", "/questions/all")
            console.log("createdQuestion")
            response.status(201).json().end()
        }).catch(validationErrors => {
            console.log(validationErrors)
            if (validationErrors.includes(ERROR_MSG_DATABASE_GENERAL)) {

                response.status(500).json(errorMessage)
                return
            } else {
                    question.customCategory = request.body.customCategory
                    //response.setHeader('Location', '/questions/by-id/' + questionId)
                    response.status(201).json().end()
            }
        })
    })

    router.get("/by-id/:questionId", (request, response) => {

        const questionId = request.params.questionId

        console.log("questionId: ", questionId)

        QuestionManager.getQuestionByIS(getQuestionById
        ).then(question => {
            response.setHeader("Location", "/questions/all")
            response.status(201).json(questions).end()
            
        }).catch(error => {
            console.log(error)
            response.status(500).json()
        })
    })

    router.get("/all", (request, response) => {

        QuestionManager.getAll(
        ).then(questions => {
            console.log("!!!!QUESTIONS: ", questions)
            response.setHeader("Location", "/questions/all")
            response.status(201).json(questions).end()
        }).catch(error => {
            response.status(500).json()
        })
    })

    return router
}