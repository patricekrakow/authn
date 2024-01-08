'use strict'
const users = require('./users')

/* TEST 1.0 */

console.log(JSON.stringify(users.users))

/* TEST 1.1 */

const email = "elvis.presley@gmail.com"
const passwordHash = "0669523ada830c7d5d6106026eb594ab669b8ff5b71229a6532220664a4efa45"
const phoneNumber = "+32473999999"

users.createUser(email, passwordHash, phoneNumber)

console.log(JSON.stringify(users.users))

/* TEST 1.2 */

for (let i = 0; i < 1000000000; i++) { Math.sqrt(i) }

const userId = users.users[0].id
const otp    = users.users[0].newPasswordHash.otp.value

const retVerifyUser = users.verifyUser(userId, otp)

console.log(retVerifyUser)
console.log(JSON.stringify(users.users))

/* TEST 1.3 */

const retCreateToken = users.createToken(email, passwordHash)
console.log(JSON.stringify(retCreateToken))

/* TEST 1.4 */

const retGetUser = users.getUser(userId)
console.log(JSON.stringify(retGetUser))
