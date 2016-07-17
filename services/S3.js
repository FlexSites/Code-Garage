'use strict'

const AWS = require('aws-sdk')
const Bluebird = require('bluebird')

const s3 = new AWS.S3({
  region: 'us-west-2',
  params: {
    Bucket: 'io.graphyte.sandbox'
  }
})

AWS.config.setPromisesDependency(Bluebird)

module.exports = {
  get (id) {
    let Key = getKey(id)
    return s3.getObject({
      Key
    }).promise()
  },
  put (id, Body) {
    let Key = getKey(id)
    return s3.putObject({
      Key,
      Body
    })
    .promise()
    .return(id)
  }
}

function getKey (id) {
  return `tokens/${id}.json`
}
