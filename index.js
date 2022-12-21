const express = require("express");
const app = express();
var convert = require("xml-js");

var allDronesURL = "https://assignments.reaktor.com/birdnest/drones";
var pilotInfoURL = "https://assignments.reaktor.com/birdnest/pilots/"; //add :serialNumber to the request parameter

let allDronesList;
let dronesInNFZList;
let PilotsInfoList;

const nestPositionX = 250000;
const nestPositionY = 250000;
const noFlyZoneRadius = 100 * 1000; // radius in units

// The general equation of a circle with radius r and origin (𝑥0,𝑦0) is (𝑥−𝑥0 ) ** 2 + (𝑦−𝑦0) ** 2 = r ** 2
// The point (x, y) lies outside, on or inside the circle
// accordingly as the expression (𝑥−𝑥0) ** 2 + (𝑦−𝑦0) ** 2 - r ** 2 is positive, zero or negative.
function isInsideNFZ(nestX, nestY, noFlyZoneRadius, droneX, droneY) {
  if ((droneX - nestX) ** 2 + (droneY - nestY) ** 2 <= noFlyZoneRadius ** 2)
    return true;
  else return false;
}

// From the equation of the circle, distance between the points (𝑥1,𝑦1) and (𝑥2,𝑦2)
// is 𝐷 = Math.sqrt((𝑥2−𝑥1)**2+(𝑦2−𝑦1)**2
function calculateDistance(nestX, nestY, droneX, droneY) {
  const distance = Math.sqrt((droneX - nestX) ** 2 + (droneY - nestY) ** 2);
  return distance / 1000; //distance to the nest in meters
}

fetch(allDronesURL)
  .then((response) => response.text())
  .then((data) =>
    JSON.parse(convert.xml2json(data, { compact: true, spaces: 2 }))
  ) // converting XML to JSON
  .then((data) => {
    allDronesList = data;
    const NFZdronesData = data.report.capture.drone.filter((drone) => {
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
        console.log("Outside NFZ");
      }
    });
    dronesInNFZList = NFZdronesData;
    console.log("drons in no-flight-zone: ", dronesInNFZList);

    return Promise.all(
      NFZdronesData.map((drone) => {
        return fetch(pilotInfoURL + drone.serialNumber._text).then((data) => {
          const distance = calculateDistance(
            nestPositionX,
            nestPositionY,
            parseFloat(drone.positionX._text),
            parseFloat(drone.positionY._text)
          );
          console.log(distance, "distance");

          const pilot = Promise.resolve(data.json());
          pilot.then((data) => {
            data.closestDistance = distance;
          });
          return pilot;
        });
      })
    );
  })
  .then((data) => {
    console.log("Pilots info: ", data);
    // TODO: compare existing list with new list

    PilotsInfoList = data;
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

app.get("/api/pilots_info", (request, response) => {
  PilotsInfoList
    ? response.json(PilotsInfoList)
    : response.json("data is not ready");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
