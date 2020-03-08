const express = require('express')
//const jwt = require('jsonwebtoken')

module.exports = ({ }) => {

   const router = express.Router()

   const secretKey = "175342C7638E1D173B45FCC2EC97E"

   function createToken(account) {
      var claims = {
         sub: account.id,
         admin: account.admin,
      }
      var token = jwt.sign(claims, secretKey)
      return token
   }

   function checkToken(token) {
      token = token.replace(/\"/g, '')
      return new Promise(function (resolve, reject) {
         jwt.verify(token, 'secret', (err, decoded) => {
            if (err) {
               reject(err)
            } else {
               resolve(decoded)
            }
         })

      })
   }

   return router
}