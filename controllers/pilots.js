const pilotsRouter = require("express").Router();
const getDataService = require("../services/getData.service");

pilotsRouter.get("/", (request, response) => {
  const pilotsInfoList = getDataService.getPilotsInfoList();
  pilotsInfoList
    ? response.json(pilotsInfoList)
    : response.status(404).send({ error: "pilots data is not ready yet" });
});

module.exports = pilotsRouter;
