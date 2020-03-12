const express = require('express')
const jwt = require('jsonwebtoken')

module.exports = ({ }) => {

   const secretKey = "175342C7638E1D173B45FCC2EC97E"

   function createToken(account, isAdmin) {

      const payload = { id: account.id }
      const accessToken = jwt.sign(payload, secretKey)

      const claims = {
         sub: account.id,
         email: account.email,
         admin: isAdmin,
      }
      var idToken = jwt.sign(claims, secretKey)
      return { accessToken, idToken }
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

   return { createToken, checkToken }
}