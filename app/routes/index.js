const router = require("express").Router();

router.use("/role", require("./role"));
router.use("/permission", require("./permission"));
router.use("/user", require("./auth"));

module.exports = router;
