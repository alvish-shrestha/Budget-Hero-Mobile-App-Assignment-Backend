const mongoose = require("mongoose");

const GoalSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        title: {
            type: String,
            required: true,
        },
        targetAmount: {
            type: Number,
            required: true,
        },
        savedAmount: {
            type: Number,
            default: 0,
        },
        deadline: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Goal", GoalSchema);