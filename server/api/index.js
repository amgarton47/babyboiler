// apiRoutes/index.js
const router = require("express").Router();

/* Example API routes:
router.use("/users", require("./users")); // matches all requests to /api/users/
router.use("/puppies", require("./puppies")); // matches all requests to  /api/puppies/
router.use("/kittens", require("./kittens")); // matches all requests to  /api/kittens/
*/

// account for non-existant api route access attempts
router.use(function (req, res, next) {
  const err = new Error("Not found.");
  err.status = 404;
  next(err);
});

module.exports = router;
