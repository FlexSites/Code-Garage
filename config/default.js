
module.exports = {
  redis: 'redis://localhost:6379',
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
