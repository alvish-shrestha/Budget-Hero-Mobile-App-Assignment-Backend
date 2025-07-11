const Transaction = require("../models/Transaction")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

exports.addTransaction = async (req, res) => {
    try {
        const {type, date, amount, category, account, note, description} = req.body;

        if (!type || !date || !amount || !category || !account || !note) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Missing required fields."
                }
            )
        }

        const transaction = new Transaction(
            {
                type,
                date,
                amount,
                category,
                account,
                note,
                description,
                userId: req.user._id,
            }
        )

        const savedTransaction = await transaction.save();

        res.status(201).json(
            {
                success: true,
                message: "Transaction saved."
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Failed to add transaction.", error: error.message
            }
        )
    }
}

exports.getTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.find({
            userId: req.user._id
        }).sort({
            date: -1
        })

        return res.status(200).json(
            {
                success: true,
                data: transaction
            }
        )

    } catch (err) {
        console.error("Error fetching transactions: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}