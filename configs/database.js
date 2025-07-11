require("dotenv").config();
const mongoose = require("mongoose")
const logger = require('../utils/logger')


module.exports = () => {
    mongoose.connect(require('../utils/databasePath')()).then(logger.info("Connected to MongoDB!"))
}
