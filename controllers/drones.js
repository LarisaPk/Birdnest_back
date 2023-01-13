/** Express router providing drones related routes
 * @module controllers/drones
 * @requires express
 */

/**
 * Express router to mount drones related functions on.
 * @type {object}
 * @const
 */
const dronesRouter = require('express').Router();

/**
 * Module contains data for the app and needed functions for data manipulating.
 * @type {object}
 * @const
 */
const dataService = require('../services/appData.service');

/**
 * Route serving all drones.
 * @name api/drones/now
 * @function
 * @memberof module:controllers/drones~dronesRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
dronesRouter.get('/now', (request, response) => {
  const allDronesList = dataService.getAllDronesList();
  if (allDronesList) {
    response.json(allDronesList);
  } else {
    response.status(404).send({ error: 'all drones data is not ready yet' });
  }
});

/**
 * Route serving drones in No Drone Zone.
 * @name /api/drones/ndz
 * @function
 * @memberof module:controllers/drones~dronesRouter
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
dronesRouter.get('/ndz', (request, response) => {
  const dronesInNDZList = dataService.getDronesInNDZList();
  if (dronesInNDZList) {
    response.json(dronesInNDZList);
  } else {
    response.status(404).send({ error: 'drones in ndz data is not ready yet' });
  }
});

module.exports = dronesRouter;
