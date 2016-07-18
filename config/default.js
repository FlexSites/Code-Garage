
module.exports = {
  redis: 'redis://h:pc56n74f0qm31nd28c6j1cuv9j9@ec2-54-243-217-112.compute-1.amazonaws.com:25349',
  env: process.env.NODE_ENV || 'development',
  aws: {
    s3: {
      region: 'us-west-2',
      params: {
        Bucket: 'io.graphyte.sandbox'
      }
    }
  }
}
