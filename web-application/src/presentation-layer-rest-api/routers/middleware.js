const express = require('express')
const jwt = require('jsonwebtoken')
const serverSecret = "175342C7638E1D173B45FCC2EC97E"

module.exports = ({ }) => {

    const authorizeLogin = (request, response, next) => {
        console.log("authorizeLogin_start")
        let payload = null

        const authorizationHeader = request.get("Authorization")
        if (authorizationHeader == null) {
            response.status(400).json({
                'status': '400',
                'message': 'No token'
            })
            return
        }
        const accessToken = authorizationHeader.substr("Bearer ".length)

        try {

            payload = jwt.verify(accessToken, serverSecret)

        } catch (e) {
            // No access token provided or the access token was invalid.
            if (e.name == "TokenExpiredError") {
                response.status(401).json({
                    'status': '401',
                    'error': 'invalid_token',
                    'message': 'Token expired'
                })
                return
            } else {
                response.status(401).json({
                    'status': '401',
                    'error': 'invalid_token',
                    'message': 'Token is invalid'
                })
                return
            }


        }

        if (payload == null) {
            response.status(401).json({
                'status': '401',
                'error': 'invalid_token',
                'message': 'The token is expired or does not exist'
            })
        }

        response.locals.id = payload.sub

        next()
    }

    return { authorizeLogin }
}
