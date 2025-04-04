const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI

exports.connectDB = async () => {

    await mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("MongoDB connected successfully")
    }).catch((err) => {
        console.log("MongoDB connection failed", err)
    })

}