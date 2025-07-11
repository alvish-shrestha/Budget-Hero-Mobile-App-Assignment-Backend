const express = require("express")
const { addTransaction, getTransaction} = require("../controller/transactionController");
const {authenticateUser} = require("../middleware/authorizedUser");
const router = express.Router()

router.post(
    "/add",
    authenticateUser,
    addTransaction,
)

router.get(
    "/",
    authenticateUser,
    getTransaction,
)

module.exports = router