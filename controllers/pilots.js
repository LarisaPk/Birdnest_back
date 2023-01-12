/**
 * Express router providing pilots related routes
 * @module controllers/pilots
 * @requires express
 */

/**
 * Express router to mount drones related functions on.
 * @type {object}
 * @const
 * @namespace dronesRouter
 */
const pilotsRouter = require('express').Router();

/**
 * Module contains data for the app and needed functions for data manipulating.
 * @type {object}
 * @const
 * @namespace dataService
 */
const dataService = require('../services/appData.service');

/**
 * Route serving pilots who violated No Drone Zone for the past 10 minutes.
 * @name api/pilots
 * @function
 * @memberof module:controllers/pilots~pilotsRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
pilotsRouter.get('/', (request, response) => {
  const pilotsInfoList = dataService.getPilotsInfoList();
  if (pilotsInfoList) {
    response.json(pilotsInfoList);
  } else {
    response.status(404).send({ error: 'pilots data is not ready yet' });
  }
});

module.exports = pilotsRouter;
