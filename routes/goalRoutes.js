const express = require("express");
const router = express.Router();
const { createGoal, getGoals, updateGoal, deleteGoal } = require("../controller/goalController");
const authenticateUser = require("../middleware/authorizedUser");

router.post(
    "/add",
    createGoal
)

router.get(
    "/get",
    getGoals
)

router.put(
    "/update/:id",
    updateGoal
)

router.delete(
    "/delete/:id",
    deleteGoal
)

module.exports = router;
