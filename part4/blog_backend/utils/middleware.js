const logger = require('./logger')

const requestLogger = (request, response, next) => {
  const start = Date.now();

  response.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${request.method} ${request.path} ${response.statusCode} - ${duration}ms ${JSON.stringify(request.body)}`);
  });

  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}