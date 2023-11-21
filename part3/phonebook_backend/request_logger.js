const requestLogger = (request, response, next) => {
    const start = Date.now();

    response.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${request.method} ${request.path} ${response.statusCode} - ${duration}ms ${JSON.stringify(request.body)}`);
    });

    next();
};

module.exports = requestLogger;