/**
 * Module contains helper functions to do mathematical calculations.
 * @module utils/helpers
 */

/**
 * Checks if point is inside or outside of the circle.
 * The general equation of a circle with radius r and origin (𝑥0,𝑦0) is (𝑥−𝑥0 ) ** 2 + (𝑦−𝑦0) ** 2 = r ** 2.
 * The point (x, y) lies outside, on or inside the circle
 * accordingly as the expression (𝑥−𝑥0) ** 2 + (𝑦−𝑦0) ** 2 - r ** 2 is positive, zero or negative.
 * @function
 * @param {number} centerX X coordinates of the cetner of the circle
 * @param {number} centerY Y coordinates of the cetner of the circle
 * @param {number} raduis radius length (in coordinates units)
 * @param {number} pointX X coordinates of the point
 * @param {number} pointY Y coordinates of the point
 * @returns {boolean} if point is incide of the circle returns true, otherwise false.
 */
function isInside(centerX, centerY, raduis, pointX, pointY) {
  if ((pointX - centerX) ** 2 + (pointY - centerY) ** 2 <= raduis ** 2) {
    return true;
  }
  return false;
}

/**
 * Calculates distance between center and the point.
 * From the equation of the circle, distance between the points (𝑥1,𝑦1) and (𝑥2,𝑦2)
 * is 𝐷 = Math.sqrt((𝑥2−𝑥1)**2+(𝑦2−𝑦1)**2
 * @function
 * @param {number} centerX X coordinates of the cetner of the circle
 * @param {number} centerY Y coordinates of the cetner of the circle
 * @param {number} pointX X coordinates of the point
 * @param {number} pointY Y coordinates of the point
 * @returns {number} distance in meters from the center to the point
 */
function calculateDistance(centerX, centerY, pointX, pointY) {
  const distance = Math.sqrt((pointX - centerX) ** 2 + (pointY - centerY) ** 2);
  return distance / 1000; // Distance to the nest in meters
}

/**
 * Compares objects by given properties
 * Used like this: obj.sort( compare )
 * @example
 * pilots.sort(compare)
 * @function
 * @param {Object} a
 * @param {Object} b
 * @param {string} a.lastName Last Name of the pilot a
 * @param {string} b.lastName Last Name of the pilot b
 * @returns {number} positive if first pilot goes higher on the list, negative if first pilot goes lower on the list, 0 if the same.
 */
function compare(a, b) {
  if (a.lastName < b.lastName) {
    return -1;
  }
  if (a.lastName > b.lastName) {
    return 1;
  }
  return 0;
}

module.exports = {
  isInside,
  calculateDistance,
  compare,
};
