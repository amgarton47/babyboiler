const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");

const PORT = process.env.PORT || 3000;
const db = require("./db");

const session = require("express-session");

// configure and create our database (session) store
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sessionStore = new SequelizeStore({ db });
const passport = require("passport");

// passport registration
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// serve up static files
app.use(express.static(path.join(__dirname, "../public")));

// logging middleware
app.use(morgan("dev"));

// body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// auth and api routes
app.use("/api", require("./api"));
app.use("/auth", require("./auth"));

// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "a wildly insecure secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

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
