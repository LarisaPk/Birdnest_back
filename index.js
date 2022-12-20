const express = require("express");
const app = express();
var convert = require("xml-js");

let allDronesList;
let dronesInNFZList;

const nestPositionX = 250000;
const nestPositionY = 250000;
const noFlyZoneRadius = 100 * 1000; // radius in units

// The general equation of a circle with radius r and origin (𝑥0,𝑦0) is (𝑥−𝑥0)+(𝑦−𝑦0)2=r2
// The point (x, y) lies outside, on or inside the circle
// accordingly as the expression (𝑥−𝑥0)2+(𝑦−𝑦0)2 - r2 is positive, zero or negative.
function isInsideNFZ(
  nestPositionX,
  nestPositionY,
  noFlyZoneRadius,
  dronePositionX,
  dronePositionY
) {
  if (
    (dronePositionX - nestPositionX) * (dronePositionX - nestPositionX) +
      (dronePositionY - nestPositionY) * (dronePositionY - nestPositionY) <=
    noFlyZoneRadius * noFlyZoneRadius
  )
    return true;
  else return false;
}

fetch("https://assignments.reaktor.com/birdnest/drones")
  .then((response) => response.text())
  .then((data) => {
    const dronesData = JSON.parse(
      convert.xml2json(data, {
        compact: true,
        spaces: 2,
      })
    );
    allDronesList = dronesData;

    const NFZdronesData = dronesData.report.capture.drone.filter((drone) => {
      if (
        isInsideNFZ(
          nestPositionX,
          nestPositionY,
          noFlyZoneRadius,
          parseFloat(drone.positionX._text),
          parseFloat(drone.positionY._text)
        )
      ) {
        return drone;
      } else {
        console.log("Outside");
      }
    });
    dronesInNFZList = NFZdronesData;
    console.log("drons in no-flight-zone", dronesInNFZList);
  });

app.get("/api/all_drones_now", (request, response) => {
  allDronesList.report
    ? response.json(allDronesList.report.capture.drone)
    : response.json("data is not ready");
});

app.get("/api/drones_in_nfz", (request, response) => {
  dronesInNFZList
    ? response.json(dronesInNFZList)
    : response.json("data is not ready");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
