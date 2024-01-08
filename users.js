'use strict'
const crypto = require('node:crypto')

/* INTERNAL STORAGE */
const users = []
/*
{
  "id": "<uuid (unique)>",
  "name": "<string>",
  "email": "<email (unique)>",
  "currentPasswordHash": "<SHA2>",
  "phoneNumber": "<phone (unique)>",
  "status": "<unconfirmed | confirmed | blocked | unblocked | ...>",
  "newPasswordHash": {
    "value": "<SHA2>",
    "otp": {
      "value": "<uuid>",
      "expiredAt": <epoch in sec>
    }
  },
  "createdAt": <epoch in sec>,
  "lastModifiedAt": <epoch in sec>
}
*/
function whereId(item) {
  return (item.id == this)
}
function whereEmail(item) {
  return (item.email = this)
}
/* INTERNAL STORAGE (END) */

/* createUser */
function createUser(name, email, passwordHash, phoneNumber) {
  const epoch = Math.floor(Date.now() / 1000) /* seconds */
  console.log(`[createUser] epoch = ${epoch}`)

  const user = {
    id: crypto.randomUUID(),
    name: name,
    email: email,
    currentPasswordHash: '',
    phoneNumber: phoneNumber,
    status: 'unconfirmed',
    newPasswordHash: {
      value:passwordHash,
      otp: {
        value: crypto.randomUUID(),
        expiredAt: epoch + 60 /* seconds */
      }
    },
    createdAt: epoch,
    lastModifiedAt: epoch
  }
  users.push(user)

  console.log(`[createUser] users = ${JSON.stringify(users)}`)
  return { code: 0 , statusCode: 201 }
}
/* verifyUser */
function verifyUser(userId, otp) {
  const epoch = Math.floor(Date.now() / 1000) /* seconds */
  console.log(`[verifyUser] epoch = ${epoch}`)

  const user = users.filter(whereId, userId)[0]
  const userIndex = users.findIndex(whereId, userId)

  if (userId != user.id) return { code: -1, statusCode: 500, response: '' }

  if (epoch > user.newPasswordHash.otp.expiredAt) return { code: -2, statusCode: 401, response: '' }

  if (otp != user.newPasswordHash.otp.value) return { code: -3, statusCode: 401, response: '' }

  users[userIndex].currentPasswordHash = user.newPasswordHash.value
  users[userIndex].status = 'confirmed'
  users[userIndex].newPasswordHash = {}
  users[userIndex].lastModifiedAt = epoch

  console.log(`[verifyUser] users = ${JSON.stringify(users)}`)
  return { code : 0, statusCode: 200, response: '<p>The user has been verified ;-)</p>' }
}
/* createToken */
function createToken(email, passwordHash) {
  const epoch = Math.floor(Date.now() / 1000) /* seconds */
  console.log(`[createToken] epoch = ${epoch}`)

  const user = users.filter(whereEmail, email)[0]

  if (email != user.email) return { code: -1, statusCode: 500 }

  if (passwordHash != user.currentPasswordHash) return { code: -2, statusCode: 401 }

  return {
    code: 0,
    statusCode: 201,
    token: `${user.id}`
  }
}
/* getUser */
function getUser(userId) {
  const epoch = Math.floor(Date.now() / 1000) /* seconds */
  console.log(`[getUser] epoch = ${epoch}`)

  const user = users.filter(whereId, userId)[0]

  if (userId != user.id) return { code: -1, statusCode: 500 }

  return {
    code: 0,
    statusCode: 200,
    user: user
  }
}
/* updateUser */
function updateUser(userId, email, phoneNumber) {
  const epoch = Math.floor(Date.now() / 1000) /* seconds */
  console.log(`[updateUser] epoch = ${epoch}`)

  const user = users.filter(whereId, userId)[0]
  const userIndex = users.findIndex(whereId, userId)

  if (userId != user.id) return { code: -1, statusCode: 500 }

  users[userIndex].email = email
  users[userIndex].phoneNumber = phoneNumber
  users[userIndex].lastModifiedAt = epoch

  return { code : 0, statusCode: 200 }
}
/* resetUserPassword */
function resetUserPassword(email, newPasswordHash) {
  const epoch = Math.floor(Date.now() / 1000) /* seconds */
  console.log(`[resetUserPassword] epoch = ${epoch}`)

  const user = users.filter(whereEmail, email)[0]
  const userIndex = users.findIndex(whereId, userId)

  if (email != user.email) return { code: -1, statusCode: 500 }

  users[userIndex].newPasswordHash = {
    value: newPasswordHash,
    otp: {
      value: crypto.randomUUID(),
      expiredAt: epoch + 60 /* seconds */
    }
  }
  users[userIndex].lastModifiedAt = epoch

  return { code : 0, statusCode: 200 }
}

exports.users = users
exports.createUser = createUser
exports.verifyUser = verifyUser
exports.createToken = createToken
exports.getUser = getUser
exports.updateUser = updateUser
exports.resetUserPassword = resetUserPassword
