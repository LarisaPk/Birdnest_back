const dronesRouter = require('express').Router();
const dataService = require('../services/appData.service');

// All drones
dronesRouter.get('/now', (request, response) => {
  const allDronesList = dataService.getAllDronesList();
  if (allDronesList) {
    response.json(allDronesList);
  } else {
    response.status(404).send({ error: 'all drones data is not ready yet' });
  }
});

// Drones in NDZ
dronesRouter.get('/ndz', (request, response) => {
  const dronesInNDZList = dataService.getDronesInNDZList();
  if (dronesInNDZList) {
    response.json(dronesInNDZList);
  } else {
    response.status(404).send({ error: 'drones in ndz data is not ready yet' });
  }
});

module.exports = dronesRouter;
