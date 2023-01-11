// Main function for the app logic.
// Calls external API, processes the data and stores it in variables.

const convert = require('xml-js');
const dataService = require('./appData.service');
const getPilotsService = require('./getPilots.service');

const allDronesURL = process.env.DRONES_URL;

function getData() {
  // This promise will resolve when the network call succeeds
  const networkPromise = fetch(allDronesURL)
    .then((response) => response.text())
    // Converting XML to JSON and then to object
    .then((data) =>
      JSON.parse(convert.xml2json(data, { compact: true, spaces: 2 }))
    )
    // Assigning data to allDronesList, returning data for dronesInNDZList
    .then((data) => dataService.filterDrones(data))
    // Assigning data to dronesInNDZList returning new data for pilotsInfoList
    .then((data) => getPilotsService.getPilots(data))
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
