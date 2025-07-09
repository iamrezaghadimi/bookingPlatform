require("dotenv").config();
const mongoose = require("mongoose")
const logger = require('../utils/logger')


// const uri = 'mongodb://localhost:27017/richard'
const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

module.exports = () => {
    mongoose.connect(uri).then(logger.info("Connected to MongoDB!"))
}
