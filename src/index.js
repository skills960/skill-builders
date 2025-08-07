const startServer = require('./_app');
const awsLambdaFastify = require('aws-lambda-fastify');

// Start the Fastify app and wrap it for Lambda
let proxy;

const buildProxy = async () => {
  if (!proxy) {
    const app = await startServer(true); // pass true to avoid listening
    proxy = awsLambdaFastify(app);
  }
  return proxy;
};

exports.handler = async (event, context) => {
  const proxy = await buildProxy();
  return proxy(event, context);
};
