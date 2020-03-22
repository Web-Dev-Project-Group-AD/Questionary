const express = require("express")
const jwt = require("jsonwebtoken")

const ERROR_MSG_DATABASE_GENERAL = "Database error."
const serverSecret = "175342C7638E1D173B45FCC2EC97E"


function authorizeRequest(request, response, next) {
  
    const authorizationHeader = request.get('authorization')
    const accessToken = authorizationHeader.substr("Bearer ".length)
    
    try {
        jwt.verify(accessToken, serverSecret)
        next()

    } catch(error) {
        if (error.name == "TokenExpiredError") {
            response.status(401).json({
                'status': '401',
                'error': 'invalid_token',
                'message': 'JWT expired'
            })
        } else {
            response.status(401).json({
                'status': '401',
                'error': 'invalid_token',
                'message': 'JWT is malformed or invalid'
            })
        }
        return
    }
}

function parseTokenFromRequest(request) {
    const authorizationHeader = request.get("authorization")
    return jwt.decode(authorizationHeader.substr("Bearer ".length))
}


module.exports = ({ QuestionManager }) => {

    const router = express.Router()

    router.post("/new-post", authorizeRequest, (request, response) => {
        console.log("newQuestion_start")

        const authorizationHeader = request.get('authorization')
        const accessToken = authorizationHeader.substr("Bearer ".length)

        console.log("authorizationHeader", authorizationHeader)
        console.log("getAllAccounts_accessToken", accessToken)

        var question = {
            author: request.body.author,
            category: request.body.category,
            title: request.body.title,
            description: request.body.description
        }

        console.log("newQuestion: ", question)

        QuestionManager.createQuestion(question
        ).then(questionId => {
            response.setHeader("Location", "/questions/by-id/" + questionId)
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

    router.get("/by-id/:questionId", (request, response) => {

        const questionId = request.params.questionId

        console.log("questionId: ", questionId)

        QuestionManager.getQuestionById(questionId
        ).then(question => {
            response.setHeader("Location", "/questions/by-id/" + questionId)
            response.status(201).json(question).end()
        }).catch(error => {
            console.log(error)
            response.status(500).json()
        })
    })

    
    router.put("/by-id/:questionId", authorizeRequest, (request, response) => {
        const questionId = request.params.questionId
        const username = parseTokenFromRequest(request).username


        const question = { 

            id: request.body.id, 
            title: request.body.title, 
            description: request.body.description, 
            author: username
        }

        console.log("edit question serverside: ", question)


        QuestionManager.updateQuestion(question
        ).then(returnedId => {
            console.log("!!!!returnedID: ", returnedId)

            response.setHeader("Location", "/questions/by-id/" + questionId)
            response.status(201).json(question).end()
        }).catch(error => {
            response.status(500).json()
        })
    })

    router.delete("/by-id/:questionId", authorizeRequest, (request, response) => {
        const questionId = request.params.questionId
        const author = request.body.username

        console.log(author)

        QuestionManager.deleteQuestionById(questionId
        ).then(() => {
            
            response.setHeader("Location", "/questions/all")
            response.status(201).json(question).end()
        }).catch(error => {
            response.status(500).json()
        })
    })

    return router
}