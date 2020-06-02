const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

const PORT = process.env.PORT || 3000;
const db = require("./db");

// serve up static files
app.use(express.static(path.join(__dirname, "../public")));

// logging middleware
app.use(morgan("dev"));

// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// matches all requests to /api
app.use("/api", require("./api"));

// serve index.html to all non-matching routes
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// handle any requests (errors) that got to this point
app.use(function (err, req, res, next) {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || "Internal server error.");
});

// sync db
const syncDb = () => db.sync();

// start listening
const startListening = () => {
  app.listen(PORT, function () {
    console.log(`Server is up and running -- listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}/`);
  });
};

async function startApp() {
  syncDb();
  startListening();
}

// set everything in motion ... ;)
startApp();
