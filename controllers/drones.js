const dronesRouter = require("express").Router();
const getDataService = require("../services/getData.service");

dronesRouter.get("/now", (request, response) => {
  const allDronesList = getDataService.getAllDronesList();
  allDronesList
    ? response.json(allDronesList)
    : response.status(404).send({ error: "all drones data is not ready yet" });
});

dronesRouter.get("/ndz", (request, response) => {
  const dronesInNDZList = getDataService.getDronesInNDZList();
  dronesInNDZList
    ? response.json(dronesInNDZList)
    : response
        .status(404)
        .send({ error: "drones in ndz data is not ready yet" });
});

module.exports = dronesRouter;
