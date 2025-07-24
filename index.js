require("dotenv").config()

const express = require("express")
const connectDB = require("./config/db")

const userRoutes = require("./routes/userRoutes")
const transactionRoutes = require("./routes/transactionRoutes")
const statsRoutes = require("./routes/statsRoutes")
const goalRoutes = require("./routes/goalRoutes")

const app = express()

connectDB()

app.use(express.json())

app.use("/api/auth", userRoutes)
app.use("/api/transaction", transactionRoutes)
app.use("/api/stats", statsRoutes)
app.use("/api/goal", goalRoutes)

module.exports = app