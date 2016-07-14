

module.exports = {
  env: process.env.NODE_ENV || 'development',
  aws: {
    s3: {
      region: 'us-west-2',
      params: {
        Bucket: 'io.graphyte.sandbox',
      },
    },
  },
};
