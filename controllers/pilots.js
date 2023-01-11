const pilotsRouter = require('express').Router();
const getDataService = require('../services/getData.service');

// Pilots who violated NDZ for the past 10 minutes
pilotsRouter.get('/', (request, response) => {
  const pilotsInfoList = getDataService.getPilotsInfoList();
  if (pilotsInfoList) {
    response.json(pilotsInfoList);
  } else {
    response.status(404).send({ error: 'pilots data is not ready yet' });
  }
});

module.exports = pilotsRouter;
