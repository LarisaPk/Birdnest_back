// Contains the majority of logic. Calls external API, processes the data and stores it in variables.
// Exports getData function and variables allDronesList, dronesInNDZList, pilotsInfoList

const convert = require('xml-js');

const allDronesURL = process.env.DRONES_URL;
const pilotInfoURL = process.env.PILOT_URL; // Add :serialNumber to the request parameter

let allDronesList;
let dronesInNDZList;
let pilotsInfoList;
let timeStamp;

const nestPositionX = 250000;
const nestPositionY = 250000;
const NDZRadius = 100 * 1000; // Radius in units

// Used as template when no information found about pilot
const unknownPilot = {
  pilotId: 'Unknown',
  firstName: 'Unknown',
  lastName: 'Unknown',
  phoneNumber: 'Unknown',
  createdDt: 'Unknown',
  email: 'Unknown',
};

// The general equation of a circle with radius r and origin (𝑥0,𝑦0) is (𝑥−𝑥0 ) ** 2 + (𝑦−𝑦0) ** 2 = r ** 2
// The point (x, y) lies outside, on or inside the circle
// accordingly as the expression (𝑥−𝑥0) ** 2 + (𝑦−𝑦0) ** 2 - r ** 2 is positive, zero or negative.
function isInsideNDZ(nestX, nestY, NdzRadius, droneX, droneY) {
  if ((droneX - nestX) ** 2 + (droneY - nestY) ** 2 <= NdzRadius ** 2) {
    return true;
  }
  return false;
}

// From the equation of the circle, distance between the points (𝑥1,𝑦1) and (𝑥2,𝑦2)
// is 𝐷 = Math.sqrt((𝑥2−𝑥1)**2+(𝑦2−𝑦1)**2
function calculateDistance(nestX, nestY, droneX, droneY) {
  const distance = Math.sqrt((droneX - nestX) ** 2 + (droneY - nestY) ** 2);
  return distance / 1000; // Distance to the nest in meters
}

// Organising pilots alphabetically by Last Name. used like this: obj.sort( compare );
function compare(a, b) {
  if (a.lastName < b.lastName) {
    return -1;
  }
  if (a.lastName > b.lastName) {
    return 1;
  }
  return 0;
}

// Assigning data to allDronesList, returning data for dronesInNDZList, assigning timeStamp
function assignAllDronesData(data) {
  // if allDronesList is undefined assignt data to it
  if (!allDronesList && data && data.report.capture.drone.length > 0) {
    allDronesList = data.report.capture.drone;
  } else if (allDronesList && data && data.report.capture.drone.length > 0) {
    allDronesList.splice(0, allDronesList.length, ...data.report.capture.drone);
  }
  // saving snapshotTimestamp value to add later to the pilot object in pilotsInfoList
  timeStamp = data.report.capture._attributes.snapshotTimestamp;
  return data.report.capture.drone.filter((drone) =>
    isInsideNDZ(
      nestPositionX,
      nestPositionY,
      NDZRadius,
      parseFloat(drone.positionX._text),
      parseFloat(drone.positionY._text)
    )
  );
}

// Assigning data to dronesInNDZList returning new data for pilotsInfoList
function assignDronesInNDZList(data) {
  // if dronesInNDZList is undefined assign data
  if (!dronesInNDZList && data && data.length > 0) {
    dronesInNDZList = data;
  } else if (dronesInNDZList && data && data.length > 0) {
    dronesInNDZList.splice(0, dronesInNDZList.length, ...data);
  }
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
              ...unknownPilot,
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

// Assigning or updatinng data to pilotsInfoList
function updatePilotsList(data) {
  // if pilotsInfoList is undefined assign data
  if (!pilotsInfoList && data && data.length > 0) {
    pilotsInfoList = data.sort(compare);
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

// Filter out pilots seen more than 10 minutes ago in NDZ
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
      filteredPilosts.sort(compare);
      // replacing content of array: splice(start, deleteCount, item1)
      pilotsInfoList.splice(0, pilotsInfoList.length, ...filteredPilosts);
    }
  }
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
    .then((data) => {
      updatePilotsList(data);
    })
    // Filter out pilots seen more than 10 minutes ago in NDZ
    .then(() => {
      fiterPilots();
    })
    .catch((error) => {
      console.log(error);
    });

  // This promise will resolve when 2 seconds have passed
  const timeOutPromise = new Promise((resolve, reject) => {
    // 2 Second delay
    setTimeout(resolve, 2000, 'Timeout Done');
  });

  Promise.all([networkPromise, timeOutPromise]).then(() => {
    console.log('Atleast 2 secs + TTL (Network/server)');
    // Repeat
    getData();
  });
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

module.exports = {
  getData,
  getAllDronesList,
  getDronesInNDZList,
  getPilotsInfoList,
};
