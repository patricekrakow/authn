'use strict'
const crypto = require('node:crypto')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const users = require('./users')
const HOST = 'localhost'
const PORT = 3000
const app = express()
app.use(bodyParser.json())
/*
POST /users
  {
    "email": "elvis.presley@gmail.com",
    "passwordHash": "0669523ada830c7d5d6106026eb594ab669b8ff5b71229a6532220664a4efa45",
    "phoneNumber": "+32473999999"
  }
  201 Created
*/
app.post('/users', (req, res) => {
  const email = req.body.email
  const passwordHash = req.body.passwordHash
  const phoneNumber = req.body.phoneNumber

  const ret = users.createUser(email, passwordHash, phoneNumber)

  res.status(ret.statusCode).end()
})
/*
GET /users/{userId}/otp/{otp}
  200 OK
  <p>The user has been verified ;-)</p>
*/
app.get('/users/:userId/otp/:otp', (req, res) => {
  const userId = req.params.userId
  const otp = req.params.otp

  const ret = users.verifyUser(userId, otp)

  res.status(ret.statusCode).send('<p>The user has been verified ;-)</p>')
})
/*
POST /tokens
  {
    "email": "",
    "passwordHash": ""
  }
  201 Created
  {
    "token": "..."
  }
*/
app.post('/tokens', (req, res) => {
  const email = req.body.email
  const passwordHash = req.body.passwordHash

  const ret = users.createToken(email, passwordHash)

  res.status(ret.statusCode).json({ token: ret.token })
})
/* LISTENING */
app.listen(PORT, HOST, () => {
  console.log(`Server is listening on <http://${HOST}:${PORT}>...`)
})
