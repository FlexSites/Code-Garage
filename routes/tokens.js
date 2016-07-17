'use strict'

const Router = require('express').Router
const json = require('body-parser').json
const Token = require('../services/Token')

let router = new Router()

function getValues (req, res) {
  try {

  } catch (ex) {
    return Bluebird.reject(new BadRequestError('Invalid answers JSON'))
  }
  let answers = JSON.parse(req.query.answers)
  let verify = Token.verifyAnswers.bind(this, answers)
  return Token.getTokenPayload(req.params.id)
    .then(verify)
    .catch(ex => {
      ex.status = 401
      throw ex
    })
    .then(payload => payload.values)
}

function getQuestions (req, res) {
  return Token.getTokenPayload(req.params.id)
    .then(payload => payload.questions)
}

function wrap (fn) {
  return (req, res, next) => {
    fn(req, res)
      .then(res.send.bind(res))
      .catch(next)
  }
}

router
  .post('/', json(), wrap(Token.createToken))
  .get('/:id/values', wrap(getValues))
  .get('/:id/questions', wrap(getQuestions))

module.exports = router
