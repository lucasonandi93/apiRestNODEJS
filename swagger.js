const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'AmpsHero',
    description: 'AmpsHero API',
  },
  host: 'localhost:3000'
};

const outputFile = './swagger-output.json';
const routes = ['./app.js'];

swaggerAutogen(outputFile, routes, doc);