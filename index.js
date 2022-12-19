const express = require('express')
const app = express()

const testData = {
    report: {
      deviceInformation: {
        listenRange: 500000,
        deviceStarted: "2022-12-15T03:10:42.975Z",
        uptimeSeconds: 33761,
        updateIntervalMs: 2000,
      },
      capture: {
        drone: [
          {
            serialNumber: "SN-X7yvZAJAcU",
            model: "HRP-DRP 1 Max",
            manufacturer: "ProDröne Ltd",
            mac: "43:2d:c9:c0:1e:5b",
            ipv4: "145.241.212.57",
            ipv6: "3acb:1d4b:f728:79e8:e464:5eab:fd9a:ef70",
            firmware: "1.9.9",
            positionY: 73011.52935657105,
            positionX: 151279.10551575432,
            altitude: 4693.452929840222,
          },
          {
            serialNumber: "SN-4y0D__ccmj",
            model: "HRP-DRP 1 Max",
            manufacturer: "ProDröne Ltd",
            mac: "c6:bd:c0:42:bc:3b",
            ipv4: "66.245.22.254",
            ipv6: "8905:12e0:37b1:f5d4:18e9:9641:eccd:2cd4",
            firmware: "6.4.3",
            positionY: 130263.1124464113,
            positionX: 232717.84547223785,
            altitude: 4123.313262793173,
          },
          {
            serialNumber: "SN-hxtSSCtD-S",
            model: "HRP-DRP 1 S",
            manufacturer: "ProDröne Ltd",
            mac: "d2:da:b1:2b:1e:d4",
            ipv4: "70.45.203.170",
            ipv6: "e9d9:2830:33d8:2c1b:07eb:ec07:180a:94ec",
            firmware: "5.2.8",
            positionY: 238573.431635532,
            positionX: 174696.50325012818,
            altitude: 4353.521103314679,
          },
          {
            serialNumber: "SN-9ODX4YqECn",
            model: "HRP-DRP 1 Max",
            manufacturer: "ProDröne Ltd",
            mac: "1f:13:82:ab:b6:a5",
          },
        ],
      },
    },
  };

  app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/drones', (request, response) => {
    response.json(testData)
  })
  
  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })