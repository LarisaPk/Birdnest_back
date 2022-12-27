const data = require("../");
// Contains the majority of logic. Calls external API, processes the data and stores it in variables.
// Exports getData function and variables allDronesList, dronesInNDZList, pilotsInfoList
const convert = require("xml-js");
var allDronesURL = "https://assignments.reaktor.com/birdnest/drones";
var pilotInfoURL = "https://assignments.reaktor.com/birdnest/pilots/"; //add :serialNumber to the request parameter

let allDronesList;
let dronesInNDZList;
let pilotsInfoList;

const nestPositionX = 250000;
const nestPositionY = 250000;
const NDZRadius = 100 * 1000; // radius in units

// The general equation of a circle with radius r and origin (𝑥0,𝑦0) is (𝑥−𝑥0 ) ** 2 + (𝑦−𝑦0) ** 2 = r ** 2
// The point (x, y) lies outside, on or inside the circle
// accordingly as the expression (𝑥−𝑥0) ** 2 + (𝑦−𝑦0) ** 2 - r ** 2 is positive, zero or negative.
function isInsideNDZ(nestX, nestY, NDZRadius, droneX, droneY) {
  if ((droneX - nestX) ** 2 + (droneY - nestY) ** 2 <= NDZRadius ** 2)
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
  let timeStamp;
  //This promise will resolve when the network call succeeds
  const networkPromise = fetch(allDronesURL)
    .then((response) => response.text())
    // Converting XML to JSON and then to object
    .then((data) =>
      JSON.parse(convert.xml2json(data, { compact: true, spaces: 2 }))
    )
    // Assigning data to allDronesList, returning data for dronesInNDZList
    .then((data) => {
      allDronesList = data;
      // saving snapshotTimestamp value to add later to the pilot object in pilotsInfoList
      timeStamp = data.report.capture._attributes.snapshotTimestamp;
      return data.report.capture.drone.filter((drone) => {
        if (
          isInsideNDZ(
            nestPositionX,
            nestPositionY,
            NDZRadius,
            parseFloat(drone.positionX._text),
            parseFloat(drone.positionY._text)
          )
        ) {
          return drone;
        }
      });
    })
    // Assigning data to dronesInNDZList returning data for pilotsInfoList
    .then((data) => {
      dronesInNDZList = data;
      // All promises must be resolved before moving on
      return Promise.all(
        data.map((drone) => {
          // calculate distance to the nest
          const distance = calculateDistance(
            nestPositionX,
            nestPositionY,
            parseFloat(drone.positionX._text),
            parseFloat(drone.positionY._text)
          );
          // Try to find pilot in pilotsInfoList if exists
          const foundPilot = pilotsInfoList
            ? pilotsInfoList.find(
                ({ droneSerialNumber }) =>
                  droneSerialNumber === drone.serialNumber._text
              )
            : null;

          // If this pilot already exists in the pilotsInfoList update data and return it
          if (foundPilot) {
            foundPilot.closestDistance =
              foundPilot.closestDistance > distance
                ? distance
                : foundPilot.closestDistance;
            foundPilot.snapshotTimestamp = timeStamp;
            return foundPilot;

            // If it is a new pilot, fetch and return data (not fetching data for pilots that are already on the list)
          } else {
            return fetch(pilotInfoURL + drone.serialNumber._text).then(
              (data) => {
                const pilot = Promise.resolve(data.json());
                // Adding closestDistance, snapshotTimestamp, droneSerialNumber to the pilot object
                pilot.then((data) => {
                  data.closestDistance = distance;
                  data.snapshotTimestamp = timeStamp;
                  data.droneSerialNumber = drone.serialNumber._text;
                });
                return pilot;
              }
            );
          }
        })
      );
    })
    // Assigning or updatinng data to pilotsInfoList
    .then((data) => {
      // if pilotsInfoList is empty assign data
      if (!pilotsInfoList && data.length > 0) {
        pilotsInfoList = data;
      } else if (data.length > 0) {
        data.forEach((pilot) => {
          // Pilot found in existing list
          const foundPilot = pilotsInfoList.find(
            ({ pilotId }) => pilotId === pilot.pilotId
          );
          if (foundPilot) {
            // Find pilot index
            const foundPilotIndex = pilotsInfoList.findIndex(
              ({ pilotId }) => pilotId === pilot.pilotId
            );
            // Update closest distance to the nest
            pilotsInfoList[foundPilotIndex].closestDistance =
              pilot.closestDistance;

            // Update timeStamp when last seen
            pilotsInfoList[foundPilotIndex].snapshotTimestamp =
              pilot.snapshotTimestamp;
          } else {
            pilotsInfoList.push(pilot);
          }
        });
      }
    })
    // Filter out pilots seen more than 10 minutes ago in NDZ
    .then(() => {
      const updatedPilotsLIST = pilotsInfoList
        ? pilotsInfoList.filter((pilot) => {
            if (
              Date.parse(timeStamp) / 1000 / 60 -
                Date.parse(pilot.snapshotTimestamp) / 1000 / 60 <
              10
            ) {
              return pilot;
            }
          })
        : null;
      // Only update pilots list if some pilots were filtered out
      if (
        updatedPilotsLIST &&
        updatedPilotsLIST.length < pilotsInfoList.length
      ) {
        pilotsInfoList = updatedPilotsLIST;
      }
    })
    .catch((error) => {
      console.log(error);
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

// Functoins that return values of corresponding variables
function getAllDronesList() {
  return allDronesList;
}

function getDronesInNDZList() {
  return dronesInNDZList;
}

function getPilotsInfoList() {
  return pilotsInfoList;
}

module.exports = {
  getData,
  getAllDronesList,
  getDronesInNDZList,
  getPilotsInfoList,
};