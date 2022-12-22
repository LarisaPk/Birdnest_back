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
const NZFRadius = 100 * 1000; // radius in units

// The general equation of a circle with radius r and origin (𝑥0,𝑦0) is (𝑥−𝑥0 ) ** 2 + (𝑦−𝑦0) ** 2 = r ** 2
// The point (x, y) lies outside, on or inside the circle
// accordingly as the expression (𝑥−𝑥0) ** 2 + (𝑦−𝑦0) ** 2 - r ** 2 is positive, zero or negative.
function isInsideNFZ(nestX, nestY, NZFRadius, droneX, droneY) {
  if ((droneX - nestX) ** 2 + (droneY - nestY) ** 2 <= NZFRadius ** 2)
    return true;
  else return false;
}

// From the equation of the circle, distance between the points (𝑥1,𝑦1) and (𝑥2,𝑦2)
// is 𝐷 = Math.sqrt((𝑥2−𝑥1)**2+(𝑦2−𝑦1)**2
function calculateDistance(nestX, nestY, droneX, droneY) {
  const distance = Math.sqrt((droneX - nestX) ** 2 + (droneY - nestY) ** 2);
  return distance / 1000; //distance to the nest in meters
}

function getData() {
  //This promise will resolve when the network call succeeds
  const networkPromise = fetch(allDronesURL)
    .then((response) => response.text())
    // Converting XML to JSON
    .then((data) =>
      JSON.parse(convert.xml2json(data, { compact: true, spaces: 2 }))
    )
    // Assigning data to allDronesList, returning data for dronesInNFZList
    .then((data) => {
      allDronesList = data;
      return data.report.capture.drone.filter((drone) => {
        if (
          isInsideNFZ(
            nestPositionX,
            nestPositionY,
            NZFRadius,
            parseFloat(drone.positionX._text),
            parseFloat(drone.positionY._text)
          )
        ) {
          return drone;
        } else {
          console.log("Outside NFZ");
        }
      });
    })
    // Assigning data to dronesInNFZList returning data for PilotsInfoList
    .then((data) => {
      dronesInNFZList = data;
      //console.log("drons in no-flight-zone: ", dronesInNFZList);
      // All promises must be resolved before moving on
      return Promise.all(
        data.map((drone) => {
          return fetch(pilotInfoURL + drone.serialNumber._text).then((data) => {
            const distance = calculateDistance(
              nestPositionX,
              nestPositionY,
              parseFloat(drone.positionX._text),
              parseFloat(drone.positionY._text)
            );
            //console.log(distance, "distance");

            const pilot = Promise.resolve(data.json());
            // Adding distance to the nest to closestDistance property
            pilot.then((data) => {
              data.closestDistance = distance;
            });
            return pilot;
          });
        })
      );
    })
    // Assigning data to PilotsInfoList
    .then((data) => {
      //console.log("Pilots info: ", data);
      // TODO: compare existing list with new list

      //console.log(PilotsInfoList);

      if (!PilotsInfoList) {
        PilotsInfoList = data;
      } else {
        console.log("PilotsInfoList already exists");
      }

      //PilotsInfoList = data;
    });

  //This promise will resolve when 2 seconds have passed
  const timeOutPromise = new Promise(function (resolve, reject) {
    // 2 Second delay
    setTimeout(resolve, 2000, "Timeout Done");
  });

  Promise.all([networkPromise, timeOutPromise]).then(function (values) {
    console.log("Atleast 2 secs + TTL (Network/server)");
    //Repeat
    getData();
  });
}
getData();

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
