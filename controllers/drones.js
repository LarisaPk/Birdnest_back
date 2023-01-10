const dronesRouter = require('express').Router();
const getDataService = require('../services/getData.service');

// All drones
dronesRouter.get('/now', (request, response) => {
  const allDronesList = getDataService.getAllDronesList();
  if (allDronesList !== 'undefined') {
    response.json(allDronesList);
  } else {
    response.status(404).send({ error: 'all drones data is not ready yet' });
  }
});

// Drones in NDZ
dronesRouter.get('/ndz', (request, response) => {
  const dronesInNDZList = getDataService.getDronesInNDZList();
  if (dronesInNDZList !== 'undefined') {
    response.json(dronesInNDZList);
  } else {
    response.status(404).send({ error: 'drones in ndz data is not ready yet' });
  }
});

module.exports = dronesRouter;
