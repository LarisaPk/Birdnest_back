const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const middleware = require("./utils/middleware");
const getDataService = require("./services/getData.service");
const pilotsRouter = require("./controllers/pilots");
const dronesRouter = require("./controllers/drones");

// CORS fix (temporary set to all)
app.use(cors());

getDataService.getData();

app.use("/api/pilots", pilotsRouter);
app.use("/api/drones", dronesRouter);
app.use(middleware.unknownEndpoint);

module.exports = app;
