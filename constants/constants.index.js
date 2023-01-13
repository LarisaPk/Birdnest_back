/**
 * Module that contains constants used in the application.
 * @module constants
 */

/**
 * Nest position X coordinates within a 500 by 500 meter square.
 * @const {number}
 */
const nestPositionX = 250000;

/**
 * Nest position Y coordinates within a 500 by 500 meter square.
 * @const {number}
 */
const nestPositionY = 250000;

/**
 * Radius of no-fly zone in cordinates units (100 meters * 1000).
 * @const {number}
 */
const NDZRadius = 100 * 1000;

/**
 * Template for not found pilot in the drones registery.
 * @const {Object.<string, string>}
 */
const unknownPilot = {
  pilotId: 'Unknown',
  firstName: 'Unknown',
  lastName: 'Unknown',
  phoneNumber: 'Unknown',
  createdDt: 'Unknown',
  email: 'Unknown',
};

module.exports = {
  nestPositionX,
  nestPositionY,
  NDZRadius,
  unknownPilot,
};
