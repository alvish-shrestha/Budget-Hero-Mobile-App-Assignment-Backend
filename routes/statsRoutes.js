const express = require("express");
const router = express.Router();
const { getStats } = require("../controller/statsController");
const { authenticateUser } = require("../middleware/authorizedUser");

router.get(
    "/",
    authenticateUser,
    getStats,
);

module.exports = router;
