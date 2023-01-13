const mathHelpers = require('../../utils/getData.math.helpers');

describe('Tests for isInside function ', () => {
  test('Point is inside the circle', () => {
    const radius = 100;
    const centerX = 0;
    const centerY = 0;
    const pointX = 50;
    const pointY = 50;

    const result = mathHelpers.isInside(
      centerX,
      centerY,
      radius,
      pointX,
      pointY
    );

    expect(result).toBe(true);
  });

  test('Point is outside the circle', () => {
    const radius = 100;
    const centerX = 0;
    const centerY = 0;
    const pointX = 200;
    const pointY = 200;

    const result = mathHelpers.isInside(
      centerX,
      centerY,
      radius,
      pointX,
      pointY
    );

    expect(result).toBe(false);
  });

  test('Point is on the circle', () => {
    const radius = 100;
    const centerX = 0;
    const centerY = 0;
    const pointX = 100;
    const pointY = 0;

    const result = mathHelpers.isInside(
      centerX,
      centerY,
      radius,
      pointX,
      pointY
    );

    expect(result).toBe(true);
  });
});

describe('Tests for calculateDistance function', () => {
  test('Distance to the nest is 85 meters', () => {
    const centerX = 0;
    const centerY = 0;
    const pointX = 85000; // in coordinates units
    const pointY = 0;

    const result = mathHelpers.calculateDistance(
      centerX,
      centerY,
      pointX,
      pointY
    );

    expect(result).toBe(85);
  });

  test('Distance to the nest is 10 meters', () => {
    const centerX = 0;
    const centerY = 0;
    const pointX = 0; // in coordinates units
    const pointY = 10000;

    const result = mathHelpers.calculateDistance(
      centerX,
      centerY,
      pointX,
      pointY
    );

    expect(result).toBe(10);
  });
});

describe('Tests for compare function', () => {
  test('Object a goes first', () => {
    const a = {
      lastName: 'Aalto',
    };
    const b = {
      lastName: 'Valo',
    };

    const result = mathHelpers.compare(a, b);

    expect(result).toBe(-1);
  });

  test('Object a goes second', () => {
    const a = {
      lastName: 'Valo',
    };
    const b = {
      lastName: 'Aalto',
    };

    const result = mathHelpers.compare(a, b);

    expect(result).toBe(1);
  });

  test('Keep current order', () => {
    const a = {
      lastName: 'Aalto',
    };
    const b = {
      lastName: 'Aalto',
    };

    const result = mathHelpers.compare(a, b);

    expect(result).toBe(0);
  });
});
