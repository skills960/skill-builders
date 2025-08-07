const app = require('./app'); // this is your Fastify app
const serverless = require('serverless-http');

module.exports.handler = serverless(app);
