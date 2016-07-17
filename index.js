'use strict'

const express = require('express')
const cors = require('cors')

const tokenRouter = require('./routes/tokens')
const ENV = process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const app = express()

app.use(cors())

app.use('/tokens', tokenRouter)

app.use((err, req, res, next) => {
  let error = {
    status: err.status || 500,
    message: err.message || err.name || 'Server Error'
  }
  if (ENV !== 'production') {
    error.stack = err.stack
  }
  res.send(error)
})

app.listen(3000)
