# Project Title

**Birdnest_backend**

Project for the Reaktor Developer Trainee, summer 2023 application. Backend.

## Table of Contents

- [About](#about)
- [Objectives](#objectives)
- [Getting Started](#getting_started)
- [Installing](#installing)
- [Usage](#usage)
- [Deployed version](#deployed)
- [Tests](#tests)
- [Contributing](#contributing)

## About

This is the pre-assignment project for Reaktor's Developer Trainee, summer 2023 programme.

According to the pre-assignment, there is a birdnest of a very rare bird. Territory arround it is monitored by the equipment that locates drones presistance. Territorry with the 100 meters raduis and the birdnest in the center stated as No Fly Zone for the drones. The goal is to create an application that will display a list of pilots who ricently violated No Fly Zone.

### Given data:

- Drone positions : GET assignments.reaktor.com/birdnest/drones
  Updated about once every 2 seconds. The equipment is set up right next to the nest. XML format.
- Pilot information : GET assignments.reaktor.com/birdnest/pilots/:serialNumber
  Only query this information for the drones violating the NDZ. Sometimes pilot information may not be found, indicated by a 404 status code.
- The position of the drones are reported as X and Y coordinates, both floating point numbers between 0-500000 (within a 500 by 500 meter square)
- The no-fly zone is a circle with a 100 meter radius, origin at position 250000,250000

Full text of the pre-assingment task can be found here: https://assignments.reaktor.com/birdnest/

This is the backend of the project.
Frontend can be found here: https://github.com/LarisaPk/Birdnest_front

## Objectives

### Objectives of the pre-assignment

Build and deploy a web application which lists all the pilots who recently violated the NDZ perimeter.

- Persist the pilot information for 10 minutes since their drone was last seen by the equipment
- Display the closest confirmed distance to the nest
- Contain the pilot name, email address and phone number
- Immediately show the information from the last 10 minutes to anyone opening the application
- Not require the user to manually refresh the view to see up-to-date information

### Objectives of this bakend project

- Repeatedly fetch data from external API with the minimun of 2 seconds intervals.
- Process the data and filter drones who violated No Fly Zone.
- Fetch the pilots of the drones in NDZ data from external API.
- Data about pilots in NDZ should be stored for 10 minutes from when their drone was last seen by the equipment.
- Process the incoming GET requests, generate and send the response to the client. JSON format.

- GET All the drones from the past snapshot<br />
  ~/api/drones/now

- GET All the drones in NDZ the past snapshot<br />
  ~api/drones/ndz<br />
  (not in use atm by the frontend though, used during development for testing)

- GET All the pilots in NDZ for the past 10 munutes<br />
  ~/api/pilots

## Getting Started

### Pre-requisites

- "node": ">=18.0.0"
  Project uses NodeJS 18 Fetch API.
  Check that you are running the latest version of Node on your computer. Run the command `node -v` in your console to see which version you have running. If its less than 18 then you need to upgrade.

- npm (installed together with NodeJS) to check version run `npm -v`<br />
  Link to NodeJS installation: https://nodejs.org/en/

- git
  check the version run `git --version`<br />
  Link to installation
  https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

### Installing

- Create a directory where you want to download this project files and go to that directory using CLI.
- Download data from a remote repository using command:<br /> `git fetch https://github.com/LarisaPk/Birdnest_back.git`
- Create .env file in the root of the project. Add following to the file (links to the external APIs):

```
DRONES_URL = "https://assignments.reaktor.com/birdnest/drones"
PILOT_URL = "https://assignments.reaktor.com/birdnest/pilots/"
```

- run `npm -install`
- run `npm run dev`
- Server should be working by now on port 3001.
- Go to http://localhost:3001/api/drones/now it should return the JSON data about the drones

## Usage

### For VSCode users

- Install REST Client extention that allows you to send HTTP request and view the response in Visual Studio Code directly.<br />
  Link: https://marketplace.visualstudio.com/items?itemName=humao.rest-client

- Go to "requests" directory of the project and see there available requests options to try.

### For other users

There are three endpoints that can be tested in the browser, for example:

- Returns all drones seen by equipment in the last snapshot<br />
  http://localhost:3001/api/drones/now

- Returns drones in NDZ in the last snapshot<br />
  http://localhost:3001/api/drones/ndz

- Returns pilots who violated NDZ for the past 10 minutes<br />
  http://localhost:3001/api/pilots

## Deployed version

Deployed version can be found here : https://birdnest-backend.cyclic.app/<br />

Correspondingly endpoints:

- https://birdnest-backend.cyclic.app/api/drones/now
- https://birdnest-backend.cyclic.app/api/drones/ndz
- https://birdnest-backend.cyclic.app/api/pilots

Because backend is deployed for free, it has limitations.

Frontend is built with this in mind:<br />
"Applications are only on for the time it takes to process individual requests. They are suspended immediately after each response is sent".<br />

More info : https://docs.cyclic.sh/serverless/on-demand

## Tests

To run tests use command `npm run test`<br />

Due to time limitations Author wrote tests only for some functionality.<br />
TODO: Write more tests.

## Author

Larisa Pyykölä.
