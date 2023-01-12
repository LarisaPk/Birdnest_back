/**
 * Middleware module
 * @module utils/middleware
 */

/**
 * Middleware for catching requests made to non-existent routes
 * @function
 * @param {callback} middleware - Express middleware.
 */
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

module.exports = {
  unknownEndpoint,
};
