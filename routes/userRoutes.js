const express = require("express")
const router = express.Router()
const { registerUser, loginUser, updateEmail, updateUsername, updatePassword} = require("../controller/userController")
const {authenticateUser} = require("../middleware/authorizedUser");

router.post(
    "/register",
    registerUser
)

router.post(
    "/login",
    loginUser
)

router.put(
    "/update-email",
    authenticateUser,
    updateEmail,
)

router.put(
    "/update-username",
    authenticateUser,
    updateUsername,
)

router.put(
    "/update-password",
    authenticateUser,
    updatePassword,
)

module.exports = router