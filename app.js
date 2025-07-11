require('express-async-errors');
require("dotenv").config();
const express = require("express");
const logger = require('./utils/logger');


const app = express();
require("./configs/database")()
require("./middlewares/security")(app)
require("./routes/")(app)
require("./middlewares/errors")(app)


const {httpsServer, httpServer, port, httpPort} = require("./configs/server")(app)
httpsServer.listen(port, () => {
    logger.info(`Server is running on https://localhost:${port}`);
});

httpServer.listen(httpPort, () => {
    logger.info(`HTTP server running on port ${httpPort}`);
});
