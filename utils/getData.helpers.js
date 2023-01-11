// The general equation of a circle with radius r and origin (𝑥0,𝑦0) is (𝑥−𝑥0 ) ** 2 + (𝑦−𝑦0) ** 2 = r ** 2
// The point (x, y) lies outside, on or inside the circle
// accordingly as the expression (𝑥−𝑥0) ** 2 + (𝑦−𝑦0) ** 2 - r ** 2 is positive, zero or negative.
function isInside(centerX, centerY, raduis, pointX, pointY) {
  if ((pointX - centerX) ** 2 + (pointY - centerY) ** 2 <= raduis ** 2) {
    return true;
  }
  return false;
}

// From the equation of the circle, distance between the points (𝑥1,𝑦1) and (𝑥2,𝑦2)
// is 𝐷 = Math.sqrt((𝑥2−𝑥1)**2+(𝑦2−𝑦1)**2
function calculateDistance(centerX, centerY, pointX, pointY) {
  const distance = Math.sqrt((pointX - centerX) ** 2 + (pointY - centerY) ** 2);
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

module.exports = {
  isInside,
  calculateDistance,
  compare,
};
