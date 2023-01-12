/**
 * Contains data for the app and needed functions
 * @module services/appData.service
 */

/**
 * Module contains constants.
 * @type {object}
 * @const
 */
const constants = require('../constants/constants.index');

/**
 * Module contains helper functions to do mathematical calculations.
 * @type {object}
 * @const
 */
const mathHelpers = require('../utils/getData.math.helpers');

/**
 * List of all drones.
 * @type {object[]}
 * @let
 */
let allDronesList;

/**
 * List of drones in No Drone Zone.
 * @type {object[]}
 * @let
 */
let dronesInNDZList;

/**
 * List of pilots in No Drone Zone for the past 10 min.
 * @type {object[]}
 * @let
 */
let pilotsInfoList;

/**
 * Time when drone was last seen by the equipment, ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ).
 * @type {string}
 * @let
 */
let timeStamp;

/**
 * Returns timeStamp of the last shapshot.
 * @function
 * @returns {string}
 */
function getTimeStamp() {
  return timeStamp;
}

/**
 * Function returns all drones .
 * @function
 * @returns {object[]} getAllDronesList.
 */
function getAllDronesList() {
  return allDronesList;
}

/**
 * Returns drones in No Drone Zone.
 * @function
 * @returns {object[]} getDronesInNDZList.
 */
function getDronesInNDZList() {
  return dronesInNDZList;
}

/**
 * Returns pilots in No Drone Zone for the past 10 minutes.
 * @function
 * @returns {object[]} pilotsInfoList.
 */
function getPilotsInfoList() {
  return pilotsInfoList;
}

/**
 * Sets TimeStamp value.
 * @function
 * @param {string} data ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
 */
function setTimeStamp(data) {
  timeStamp = data;
}

/**
 * Sets AllDronesList value.
 * @function
 * @param {object[]} data all drones seen by equipment in last snapshot
 */
function setAllDronesList(data) {
  // If allDronesList is undefined assignt data to it.
  if (!allDronesList && data && data.report.capture.drone.length > 0) {
    allDronesList = data.report.capture.drone;
  } else if (allDronesList && data && data.report.capture.drone.length > 0) {
    // Replacing content of array with data array: splice(start, deleteCount, item1).
    allDronesList.splice(0, allDronesList.length, ...data.report.capture.drone);
  }
}

/**
 * Sets DronesInNDZList value.
 * @function
 * @param {object[]} data drones in No Drone Zone
 */
function setDronesInNDZList(data) {
  // If dronesInNDZList is undefined assign data to it.
  if (!dronesInNDZList && data && data.length > 0) {
    dronesInNDZList = data;
  } else if (dronesInNDZList && data && data.length > 0) {
    // Replacing content of array with data array: splice(start, deleteCount, item1).
    dronesInNDZList.splice(0, dronesInNDZList.length, ...data);
  }
}

/**
 * Update current pilot if already exists or add new pilot to pilotsInfoList if does not exist.
 * @function
 * @param {object[]} data all pilots info in No Drone Zone from last snapshot
 */
function setPilotsInfoList(data) {
  // If pilotsInfoList is undefined assign data.
  if (!pilotsInfoList && data && data.length > 0) {
    // Sorting by Last Name alphabetically.
    pilotsInfoList = data.sort(mathHelpers.compare);
  } else if (pilotsInfoList && data && data.length > 0) {
    data.forEach((pilot) => {
      // Pilot found in existing list.
      const foundPilot = pilotsInfoList.find(
        ({ droneSerialNumber }) => droneSerialNumber === pilot.droneSerialNumber
      );
      if (foundPilot) {
        // Find existing pilot's index.
        const foundPilotIndex = pilotsInfoList.findIndex(
          ({ droneSerialNumber }) =>
            droneSerialNumber === pilot.droneSerialNumber
        );

        // Update closest distance to the nest.
        pilotsInfoList[foundPilotIndex].closestDistance = pilot.closestDistance;

        // Update timeStamp when last seen.
        pilotsInfoList[foundPilotIndex].snapshotTimestamp =
          pilot.snapshotTimestamp;
      } else {
        // If pilot does not exist in current list - add it.
        pilotsInfoList.push(pilot);
      }
    });
  }
}

/**
 * Filter out pilots seen more than 10 minutes ago in NDZ, sort by Last Name
 * @function
 */
function fiterPilots() {
  if (pilotsInfoList) {
    // Add lastSeenMinAgo data to pilot object.
    const updatedPilots = pilotsInfoList.map((pilot) => ({
      ...pilot,
      lastSeenMinAgo:
        Date.parse(timeStamp) / 1000 / 60 -
        Date.parse(pilot.snapshotTimestamp) / 1000 / 60,
    }));

    // Filter out pilots last seen more than 10 min ago.
    const filteredPilosts = updatedPilots.filter(
      (pilot) => pilot.lastSeenMinAgo <= 10
    );

    //  Update pilotsInfoList.
    if (pilotsInfoList && filteredPilosts) {
      // Sorting by Last Name alphabetically.
      filteredPilosts.sort(mathHelpers.compare);

      // Replacing content of array: splice(start, deleteCount, item1).
      pilotsInfoList.splice(0, pilotsInfoList.length, ...filteredPilosts);
    }
  }
}

/**
 * Assigning data to allDronesList, assigning timeStamp, filtering drones, returning data for dronesInNDZList.
 * @function
 * @param {object[]} data all drones seen by equipment in last snapshot.
 * @returns {object[]} drones in No Drone Zone in last Snapshot.
 */
function filterDrones(data) {
  setAllDronesList(data);

  // Saving snapshotTimestamp value to add later to the pilot object in pilotsInfoList.
  setTimeStamp(data.report.capture._attributes.snapshotTimestamp);

  // Filtering out drones not in No Drone Zone.
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
