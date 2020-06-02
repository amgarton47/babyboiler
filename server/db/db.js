const Sequelize = require("sequelize");

// const db = new Sequelize("boilerDB", {
//   host: "localhost",
//   dialect: "postgres",
//   logging: false,
// });

const db = new Sequelize(
  process.env.DATABASE_URL || "postgres://localhost:5432/boilerDB",
  {
    logging: false,
  }
);

module.exports = db;
