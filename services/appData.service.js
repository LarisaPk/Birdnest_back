// Contains data for the app and needed functions

const constants = require('../constants/constants.index');
const mathHelpers = require('../utils/getData.math.helpers');

let allDronesList;
let dronesInNDZList;
let pilotsInfoList;
let timeStamp;

function getTimeStamp() {
  return timeStamp;
}

function getAllDronesList() {
  return allDronesList;
}

function getDronesInNDZList() {
  return dronesInNDZList;
}

function getPilotsInfoList() {
  return pilotsInfoList;
}

function setTimeStamp(data) {
  timeStamp = data;
}

function setAllDronesList(data) {
  // if allDronesList is undefined assignt data to it
  if (!allDronesList && data && data.report.capture.drone.length > 0) {
    allDronesList = data.report.capture.drone;
  } else if (allDronesList && data && data.report.capture.drone.length > 0) {
    allDronesList.splice(0, allDronesList.length, ...data.report.capture.drone);
  }
}

function setDronesInNDZList(data) {
  // if dronesInNDZList is undefined assign data
  if (!dronesInNDZList && data && data.length > 0) {
    dronesInNDZList = data;
  } else if (dronesInNDZList && data && data.length > 0) {
    // replacing content of array: splice(start, deleteCount, item1)
    dronesInNDZList.splice(0, dronesInNDZList.length, ...data);
  }
}

// Update current list or add new pilot to it
function setPilotsInfoList(data) {
  // if pilotsInfoList is undefined assign data
  if (!pilotsInfoList && data && data.length > 0) {
    pilotsInfoList = data.sort(mathHelpers.compare);
  } else if (pilotsInfoList && data && data.length > 0) {
    data.forEach((pilot) => {
      // Pilot found in existing list
      const foundPilot = pilotsInfoList.find(
        ({ droneSerialNumber }) => droneSerialNumber === pilot.droneSerialNumber
      );
      if (foundPilot) {
        // Find pilot index
        const foundPilotIndex = pilotsInfoList.findIndex(
          ({ droneSerialNumber }) =>
            droneSerialNumber === pilot.droneSerialNumber
        );
        // Update closest distance to the nest
        pilotsInfoList[foundPilotIndex].closestDistance = pilot.closestDistance;
        // Update timeStamp when last seen
        pilotsInfoList[foundPilotIndex].snapshotTimestamp =
          pilot.snapshotTimestamp;
      } else {
        pilotsInfoList.push(pilot);
      }
    });
  }
}

// Filter out pilots seen more than 10 minutes ago in NDZ, sort by Last Name
function fiterPilots() {
  if (pilotsInfoList) {
    // Add lastSeenMinAgo data to pilot
    const updatedPilots = pilotsInfoList.map((pilot) => ({
      ...pilot,
      lastSeenMinAgo:
        Date.parse(timeStamp) / 1000 / 60 -
        Date.parse(pilot.snapshotTimestamp) / 1000 / 60,
    }));

    const filteredPilosts = updatedPilots.filter(
      (pilot) => pilot.lastSeenMinAgo <= 10
    );
    //  Update pilotsInfoList
    if (pilotsInfoList && filteredPilosts) {
      filteredPilosts.sort(mathHelpers.compare);
      // Replacing content of array: splice(start, deleteCount, item1)
      pilotsInfoList.splice(0, pilotsInfoList.length, ...filteredPilosts);
    }
  }
}

// Assigning data to allDronesList, assigning timeStamp, filtering drones, returning data for dronesInNDZList
function filterDrones(data) {
  setAllDronesList(data);

  // saving snapshotTimestamp value to add later to the pilot object in pilotsInfoList
  setTimeStamp(data.report.capture._attributes.snapshotTimestamp);

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

module.exports = {
  getTimeStamp,
  getAllDronesList,
  getDronesInNDZList,
  getPilotsInfoList,
  setTimeStamp,
  setAllDronesList,
  setDronesInNDZList,
  setPilotsInfoList,
  fiterPilots,
  filterDrones,
};
