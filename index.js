//import express
const express = require("express");
// init express
const app = express();
const archiver = require("archiver");
const axios = require("axios");
const path = require("path");

// basic route
app.get("/", (req, res) => {
  const archive = archiver("zip");

  archive.on("error", function (err) {
    console.log(err);
    res.status(500).send({ error: err.message });
  });

  //on stream closed we can end the request
  archive.on("end", function () {
    console.log("Archive wrote %d bytes", archive.pointer());
  });

  //set the archive name
  res.attachment("test-archive-name.zip");

  //this is the streaming magic
  archive.pipe(res);

  const downloadPath = [
    "https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
    "https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
    "https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
    "https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
    "https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
    "https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
    "https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
    "https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
    "https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
    "https://i.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U",
  ];

  const axiosList = [];

  downloadPath.forEach((element) => {
    axiosList.push(
      axios.get(element, {
        responseType: "arraybuffer",
      })
    );
  });

  axios
    .all(axiosList)
    .then(
      axios.spread((...responses) => {
        for (let index = 0; index < axiosList.length; index++) {
          const element = responses[index];
          const buffer = Buffer.from(element.data);
          archive.append(buffer, { name: `${index + 1}.jpg` });
        }
        archive.finalize();
      })
    )
    .catch((errors) => {
      console.log(errors);
    });
});

// listen on port
app.listen(3000, () => console.log("Server Running at http://localhost:3000"));
