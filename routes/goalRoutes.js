const express = require("express");
const router = express.Router();
const { createGoal, getGoals, updateGoal, deleteGoal, contributeToGoal } = require("../controller/goalController");
const { authenticateUser } = require("../middleware/authorizedUser");

router.post(
    "/add",
    authenticateUser,
    createGoal
)

router.get(
    "/get",
    authenticateUser,
    getGoals
)

router.put(
    "/update/:id",
    authenticateUser,
    updateGoal
)

router.delete(
    "/delete/:id",
    authenticateUser,
    deleteGoal
)

router.patch(
    "/contribute/:goalId",
    authenticateUser,
    contributeToGoal
)

module.exports = router;