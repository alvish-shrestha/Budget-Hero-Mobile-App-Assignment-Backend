const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        confirmPassword: {
            type: String,
        },
        resetToken: {
            type: String,
        },
        resetTokenExpires: {
            type: Date,
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model(
    "User", UserSchema
)