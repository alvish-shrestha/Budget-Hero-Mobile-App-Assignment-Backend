const mongoose = require('mongoose')

const TransactionSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["income", "expense"],
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        account: {
            type: String,
            required: true,
        },
        note: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            default: "",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "Transaction", TransactionSchema
)