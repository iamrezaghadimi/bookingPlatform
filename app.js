require('express-async-errors');
require("dotenv").config();
const express = require("express");


const app = express();
require("./configs/database")()
require("./middlewares/security")(app)
require("./routes/")(app)
require("./middlewares/errors")(app)


const {httpsServer, httpServer, port, httpPort} = require("./configs/server")()
httpsServer.listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});
httpServer.listen(httpPort, () => {
    console.log(`HTTP server running on port ${httpPort}`);
});
