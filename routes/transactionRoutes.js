const express = require("express")
const { addTransaction, getTransaction, updateTransaction, deleteTransaction} = require("../controller/transactionController");
const {authenticateUser} = require("../middleware/authorizedUser");
const router = express.Router()

router.post(
    "/add",
    authenticateUser,
    addTransaction,
)

router.get(
    "/get",
    authenticateUser,
    getTransaction,
)

router.put(
    "/update/:id",
    authenticateUser,
    updateTransaction,
)

router.delete(
    "/delete/:id",
    authenticateUser,
    deleteTransaction,
)

module.exports = router