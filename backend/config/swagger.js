const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'LeylaDigital API',
      version: '1.0.0',
      description: 'Production-ready API for LeylaDigital Marketing Agency',
      contact: {
        name: 'API Support',
        url: 'https://leyladigital.vercel.app',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000/api',
        description: 'Development server',
      },
      {
        url: 'https://leyladigital.vercel.app/api',
        description: 'Production server',
      },
    ],
  },
  apis: ['./routes/*.js', './controllers/*.js'], // Files containing annotations
};

const specs = swaggerJsdoc(options);

module.exports = specs;
