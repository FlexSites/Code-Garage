'use strict'

const assert = require('assert')
const uuid = require('uuid')
const Bluebird = require('bluebird')

const Redis = require('redis')
const redis = Redis.createClient()

const s3 = require('./S3')

const alphabet = '$CMGXS@T!1B&YFLEI9AW38JK76NUDH5R4Z2?O0PQV'

const Cipher = require('./Cipher')
const cipher = new Cipher(alphabet)

const redisGet = Bluebird.promisify(redis.get, { context: redis })

let id = 1000000000

function createToken (req, res) {
  let body = req.body
  let expires = Date.now() + (60 * 60 * 24)
  if (body.expires) {
    // Default expiration 24hrs
    expires = body.expires
  }
  id++
  let uniq = uuid.v4()
  let token = cipher.encode(id)

  assert(!!body.values, 'Field "value" must be set.')
  assert(Array.isArray(body.questions), 'Field "questions" must be an array.')
  assert(Array.isArray(body.answers), 'Field "answers" must be an array.')
  console.log('hitting here!!!');
  return s3.put(uniq, JSON.stringify(body))
    .then((Key) => {
      body.id = token
      redis.set(token, JSON.stringify({ Key }))
      redis.expire(token, expires)
    })
    .return(token)
}

function verifyAnswers (given, payload) {

  assert(Array.isArray(given), 'Answers must be an Array')

  payload.answers.map((answer, idx) => {
    if (answer.toLowerCase() !== given[idx].toLowerCase()) {
      throw new Error('Incorrect answer!')
    }
  })
  return payload
}

function getTokenPayload (token) {
  return redisGet(token)
    .then(value => {
      let data = JSON.parse(value)
      return s3.get(data.Key)
        .then(results => JSON.parse(results.Body.toString('utf8')))
    })
}

module.exports = {
  getTokenPayload,
  verifyAnswers,
  createToken
}
