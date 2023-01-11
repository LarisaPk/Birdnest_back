const mathHelpers = require('../utils/getData.math.helpers');
const constants = require('../constants/constants.index');
const dataService = require('./appData.service');

const pilotInfoURL = process.env.PILOT_URL; // Add :serialNumber to the request parameter

// Assigning data to dronesInNDZList returning new data for pilotsInfoList
function getPilots(data) {
  dataService.setDronesInNDZList(data);
  // All promises must be resolved before moving on
  return Promise.all(
    data.map((drone) => {
      // Calculate distance to the nest
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
      }
      // If it is a new pilot, fetch and return data (not fetching data for pilots that are already on the list)
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

module.exports = {
  getPilots,
};
