const Transaction = require("../models/Transaction")
const moment = require("moment")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

exports.addTransaction = async (req, res) => {
    try {
        const {type, date, amount, category, account, note, description} = req.body;

        if (!type || !date || !amount || !category || !account || !note) {
            return res.status(400).json(
                {
                    success: false,
                    message: "Missing required fields"
                }
            )
        }

        const formattedDate = moment(date).format("YYYY-MM-DD");

        const transaction = new Transaction(
            {
                type,
                date: formattedDate,
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
                message: "Transaction saved"
            }
        )
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                message: "Failed to add transaction", error: error.message
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
                message: "Data fetched successfully",
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

exports.updateTransaction = async (req, res) => {
    const {id} = req.params

    try {
        if (req.body.date) {
            req.body.date = moment(req.body.date).format("YYYY-MM-DD");
        }

        const updatedTransaction = await Transaction.findOneAndUpdate(
            {
                _id: id,
                userId: req.user._id
            },
            {
                $set: req.body
            },
            {
                new: true,
                runValidators: true
            }
        )

        if (!updatedTransaction) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Transaction not found"
                }
            )
        }

        return res.status(200).json(
            {
                success: true,
                message: "Transaction updated",
                data: updatedTransaction
            }
        )
    } catch (err) {
        console.error("Error updating transaction: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params

    try {
        const deletedTransaction = await Transaction.findOneAndDelete(
            {
                _id: id,
                userId: req.user._id
            }
        )

        if (!deletedTransaction) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Transaction not found"
                }
            )
        }

        return res.status(200).json(
            {
                success: true,
                message: "Transaction deleted"
            }
        )
    } catch (err) {
        console.error("Error deleting transaction: ", err)
        return res.status(500).json(
            {
                success: false,
                message: "Server error"
            }
        )
    }
}
