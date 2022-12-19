const express = require("express");
const app = express();
var convert = require("xml-js");

const getData = async () => {
  const res = await fetch("https://assignments.reaktor.com/birdnest/drones");
  if (res.ok) {
    const data = await res;
    const content = await res.text();
    console.log(convert.xml2json(content, { compact: true, spaces: 4 }));
    const dronesDataJson = convert.xml2json(content, {
      compact: true,
      spaces: 4,
    });
    return dronesDataJson;
  }
};

getData();

app.get("/api/drones", (request, response) => {
  response.json("test");
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
