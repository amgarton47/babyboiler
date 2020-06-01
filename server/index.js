const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

// serve up static files
app.use(express.static(path.join(__dirname, "../public")));

// logging middleware
const morgan = require("morgan");
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

// start server
const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`Server is up and running -- listening on port ${port}`);
});
