const constants = require('../../constants/constants.index');
const mathHelpers = require('../../utils/getData.math.helpers');
const appData = require('../../services/appData.service');

const data = {
  report: {
    capture: {
      drone: [
        {
          serialNumber: {
            _text: 'SN-H5FZQyv8XB',
          },
          model: {
            _text: 'HRP-DRP 1 S',
          },
          manufacturer: {
            _text: 'ProDröne Ltd',
          },
          mac: {
            _text: '76:52:6d:7e:e2:8e',
          },
          ipv4: {
            _text: '111.162.17.129',
          },
          ipv6: {
            _text: 'e347:5642:e7f5:7cef:8806:d122:bb36:89e8',
          },
          firmware: {
            _text: '2.1.5',
          },
          positionY: {
            _text: '114173.86021696328',
          },
          positionX: {
            _text: '471392.8537947447',
          },
          altitude: {
            _text: '4765.703172167861',
          },
        },
        {
          serialNumber: {
            _text: 'SN-k-X_Agxbuj',
          },
          model: {
            _text: 'Altitude X',
          },
          manufacturer: {
            _text: 'DroneGoat Inc',
          },
          mac: {
            _text: '30:c3:de:a7:c7:aa',
          },
          ipv4: {
            _text: '16.17.115.241',
          },
          ipv6: {
            _text: '3fe2:f08e:7eaf:a88f:50e2:68e0:a79d:36ed',
          },
          firmware: {
            _text: '3.8.2',
          },
          positionY: {
            _text: '346289.45844705886',
          },
          positionX: {
            _text: '223596.81901673373',
          },
          altitude: {
            _text: '4384.058361226004',
          },
        },
      ],
    },
  },
};

const testAllDronesList = [
  {
    serialNumber: {
      _text: 'SN-H5FZQyv8XB',
    },
    model: {
      _text: 'HRP-DRP 1 S',
    },
    manufacturer: {
      _text: 'ProDröne Ltd',
    },
    mac: {
      _text: '76:52:6d:7e:e2:8e',
    },
    ipv4: {
      _text: '111.162.17.129',
    },
    ipv6: {
      _text: 'e347:5642:e7f5:7cef:8806:d122:bb36:89e8',
    },
    firmware: {
      _text: '2.1.5',
    },
    positionY: {
      _text: '114173.86021696328',
    },
    positionX: {
      _text: '471392.8537947447',
    },
    altitude: {
      _text: '4765.703172167861',
    },
  },
  {
    serialNumber: {
      _text: 'SN-k-X_Agxbuj',
    },
    model: {
      _text: 'Altitude X',
    },
    manufacturer: {
      _text: 'DroneGoat Inc',
    },
    mac: {
      _text: '30:c3:de:a7:c7:aa',
    },
    ipv4: {
      _text: '16.17.115.241',
    },
    ipv6: {
      _text: '3fe2:f08e:7eaf:a88f:50e2:68e0:a79d:36ed',
    },
    firmware: {
      _text: '3.8.2',
    },
    positionY: {
      _text: '346289.45844705886',
    },
    positionX: {
      _text: '223596.81901673373',
    },
    altitude: {
      _text: '4384.058361226004',
    },
  },
];

describe('Tests for timeStamp', () => {
  test('getTimeStamp returns "undefined" when no data assigned yet', () => {
    const result = appData.getTimeStamp();
    expect(result).toBeUndefined();
  });

  test('setTimeStamp sets data, getTimeStamp returns it', () => {
    appData.setTimeStamp('2023-01-13T12:04:09.855Z');
    const result = appData.getTimeStamp();
    expect(result).not.toBeUndefined();
    expect(result).toBe('2023-01-13T12:04:09.855Z');
  });

  test('Twice used setTimeStamp sets data, getTimeStamp returns latest', () => {
    appData.setTimeStamp('2022-12-13T12:04:09.855Z');
    appData.setTimeStamp('2024-11-13T12:04:09.855Z');
    const result = appData.getTimeStamp();
    expect(result).not.toBeUndefined();
    expect(result).toBe('2024-11-13T12:04:09.855Z');
  });
});

describe('Tests for allDronesList', () => {
  test('getAllDronesList returns "undefined" when no data assigned yet', () => {
    const result = appData.getAllDronesList();
    expect(result).toBeUndefined();
  });

  test('setAllDronesList sets data correctly', () => {
    appData.setAllDronesList(data);
    const result = appData.getAllDronesList(data);
    expect(result).not.toBeUndefined();
    expect(result).toHaveLength(2);
    expect(result).toEqual(testAllDronesList);
  });
});
