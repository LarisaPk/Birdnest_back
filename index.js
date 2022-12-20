const express = require("express");
const app = express();
var convert = require("xml-js");

let allDronesList;

const nestPositionX = 250000;
const nestPositionY = 250000;
const noFlyZoneRadius = 100 * 1000; // radius in units

const getDronesData = async () => {
  const res = await fetch("https://assignments.reaktor.com/birdnest/drones");
  if (res.ok) {
    const data = await res;
    const content = await res.text();
    console.log(convert.xml2json(content, { compact: true, spaces: 4 }));
    const dronesDataJson = convert.xml2json(content, {
      compact: true,
      spaces: 2,
    });
    allDronesList = JSON.parse(dronesDataJson);
  }
};

getDronesData();

app.get("/api/all_drones_now", (request, response) => {
  allDronesList.report
    ? response.json(allDronesList.report.capture.drone)
    : response.json("data is not ready");
});

app.get("/api/drones_in_nfz", (request, response) => {
  dronesInNFZ
    ? response.json(adronesInNFZ)
    : response.json("data is not ready");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
