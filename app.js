require("dotenv").config();
const fs = require("fs");
const express = require("express");
const debug = require("debug")("app:normal");
const morgan = require("morgan");
const mongoose = require("mongoose")
const flightsRouter = require("./routes/flights");
const hotelsRouter = require("./routes/hotels");
const usersRouter = require("./routes/users");


// new guys
const http = require('https')
const https = require('https')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const session = require('express-session')
const MongoStore = require('connect-mongo')


// const uri = 'mongodb://localhost:27017/richard'
const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

mongoose.connect(uri).then(() => {
    console.log("Connected to mongodb!");
}).catch((err)=>{
    console.log("Error connecting to mongodb:", err);
})


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded

if(app.get('env')==="development"){
    app.use(morgan('dev'))
}

app.use("/flights", flightsRouter);
app.use("/hotels", hotelsRouter);
app.use("/users", usersRouter);


app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).json({ error: "Invalid JSON syntax" });
    }
    next();
});


const options = {
    key: fs.readFile("./keys/key.pem"),
    cert: fs.readFile("./keys/cert.pem")
}

https.createServer(options, app).listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
})

http.createServer((req,res) => {
    res.writeHead(301, {location: `https://localhost:${httpPort}${req.url}`})
}).listen(port, () => {
    console.log(`HTTP server is running on port ${httpPort} (redirecting to HTTPS)`);
});
