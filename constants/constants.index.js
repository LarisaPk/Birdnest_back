// Constants used in the project

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

module.exports = {
  nestPositionX,
  nestPositionY,
  NDZRadius,
  unknownPilot,
};
