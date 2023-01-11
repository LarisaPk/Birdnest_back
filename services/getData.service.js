// Contains the majority of logic. Calls external API, processes the data and stores it in variables.
// Exports getData function and variables allDronesList, dronesInNDZList, pilotsInfoList

const convert = require('xml-js');
const mathHelpers = require('../utils/getData.math.helpers');
// const processingHelpers = require('../utils/getData.processing.helpers');
const constants = require('../constants/constants.index');
const dataService = require('./appData.service');

const allDronesURL = process.env.DRONES_URL;
const pilotInfoURL = process.env.PILOT_URL; // Add :serialNumber to the request parameter

// Assigning data to allDronesList, assigning timeStamp, returning data for dronesInNDZList
function assignAllDronesData(data) {
  dataService.setAllDronesList(data);

  // saving snapshotTimestamp value to add later to the pilot object in pilotsInfoList
  dataService.setTimeStamp(data.report.capture._attributes.snapshotTimestamp);

  return data.report.capture.drone.filter((drone) =>
    mathHelpers.isInside(
      constants.nestPositionX,
      constants.nestPositionY,
      constants.NDZRadius,
      parseFloat(drone.positionX._text),
      parseFloat(drone.positionY._text)
    )
  );
}

// Assigning data to dronesInNDZList returning new data for pilotsInfoList
function assignDronesInNDZList(data) {
  dataService.setDronesInNDZList(data);
  // All promises must be resolved before moving on
  return Promise.all(
    data.map((drone) => {
      // calculate distance to the nest
      const distance = mathHelpers.calculateDistance(
        constants.nestPositionX,
        constants.nestPositionY,
        parseFloat(drone.positionX._text),
        parseFloat(drone.positionY._text)
      );

      const pilotsInfoList = dataService.getPilotsInfoList();
      const timeStamp = dataService.getTimeStamp();

      // Try to find pilot in pilotsInfoList if exists
      const foundPilot = pilotsInfoList
        ? pilotsInfoList.find(
            ({ droneSerialNumber }) =>
              droneSerialNumber === drone.serialNumber._text
          )
        : null;

      // If this pilot already exists in the pilotsInfoList copy, update data and return copy
      if (foundPilot) {
        const lastseenMinAgo =
          Date.parse(timeStamp) / 1000 / 60 -
          Date.parse(foundPilot.snapshotTimestamp) / 1000 / 60;

        return {
          ...foundPilot,
          closestDistance:
            foundPilot.closestDistance > distance
              ? distance
              : foundPilot.closestDistance,
          snapshotTimestamp: timeStamp,
          lastSeenMinAgo: lastseenMinAgo,
        };

        // If it is a new pilot, fetch and return data (not fetching data for pilots that are already on the list)
      }
      return fetch(pilotInfoURL + drone.serialNumber._text)
        .then((response) => {
          if (response.ok && response.status === 200) {
            const pilot = Promise.resolve(response.json());
            const pilotAddedData = pilot
              .then((pilotData) => {
                // Adding closestDistance, snapshotTimestamp, droneSerialNumber to the pilot object
                const result = {
                  ...pilotData,
                  closestDistance: distance,
                  snapshotTimestamp: timeStamp,
                  droneSerialNumber: drone.serialNumber._text,
                  lastSeenMinAgo: 0,
                };
                return result;
              })
              .catch((error) => {
                console.log(error);
              });
            return pilotAddedData;
          }
          if (response.status === 404) {
            console.log('Pilot infromation is not found');
            return {
              ...constants.unknownPilot,
              closestDistance: distance,
              snapshotTimestamp: timeStamp,
              droneSerialNumber: drone.serialNumber._text,
              lastSeenMinAgo: 0,
            };
          }
          return Promise.reject(
            new Error(`some other error: ${response.status}`)
          );
        })
        .catch((error) => console.log('error is', error));
    })
  );
}

function getData() {
  // This promise will resolve when the network call succeeds
  const networkPromise = fetch(allDronesURL)
    .then((response) => response.text())
    // Converting XML to JSON and then to object
    .then((data) =>
      JSON.parse(convert.xml2json(data, { compact: true, spaces: 2 }))
    )
    // Assigning data to allDronesList, returning data for dronesInNDZList
    .then((data) => assignAllDronesData(data))
    // Assigning data to dronesInNDZList returning new data for pilotsInfoList
    .then((data) => assignDronesInNDZList(data))
    // Assigning or updatinng data to pilotsInfoList
    .then((data) => dataService.setPilotsInfoList(data))
    // Filter out pilots seen more than 10 minutes ago in NDZ
    .then(() => dataService.fiterPilots())
    .catch((error) => console.log(error));

  // This promise will resolve when 2 seconds have passed
  const timeOutPromise = new Promise((resolve, reject) => {
    // 2 Second delay
    setTimeout(resolve, 2000, 'Timeout Done');
  });

  // Making sure that both promises resolve before moving on. In case of for example slow Internet.
  Promise.all([networkPromise, timeOutPromise]).then(() => {
    console.log('Atleast 2 secs + TTL (Network/server)');
    // Repeat
    getData();
  });
}

module.exports = {
  getData,
};
