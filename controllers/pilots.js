const pilotsRouter = require("express").Router();
const getDataService = require("../services/getData.service");

pilotsRouter.get("/info", (request, response) => {
  const pilotsInfoList = getDataService.getPilotsInfoList();
  pilotsInfoList
    ? response.json(pilotsInfoList)
    : response.status(404).send({ error: "data is not ready yet" });
});

module.exports = pilotsRouter;
