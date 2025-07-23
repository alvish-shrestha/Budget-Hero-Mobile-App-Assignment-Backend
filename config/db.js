const mongoose = require("mongoose")
require("colors")

const CONNECTION_STRING = process.env.MONGODB_URI
const connectDB = async () => {
    try {
        await mongoose.connect(
            CONNECTION_STRING,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        )
        console.log("Mongodb connected".white.underline.bold);
    } catch (err) {
        console.log(`Database error: ${err.message}`.red.underline.bold);
    }
}

module.exports = connectDB