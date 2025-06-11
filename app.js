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
const http = require('http')
const https = require('https')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const session = require('express-session')
const MongoStore = require('connect-mongo');


// const uri = 'mongodb://localhost:27017/richard'
const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

mongoose.connect(uri).then(() => {
    console.log("Connected to mongodb!");
}).catch((err)=>{
    console.log("Error connecting to mongodb:", err);
})


const app = express();
const port = process.env.PORT || 3000;
const httpPort = process.env.HTTP_PORT || 80;
app.use(express.json());  // For parsing application/json
app.use(express.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded
app.use(helmet())

if(app.get('env')==="development"){
    app.use(morgan('dev'))
}


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 24 * 60 * 60 * 1000 // 24 hours expiration
    },
    store: MongoStore.create({mongoUrl: uri})
}))


const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: {error: "Too many login attempts. Try again later..."}
})

app.use("/users/signin", loginLimiter)

app.use("/flights", flightsRouter);
app.use("/hotels", hotelsRouter);
app.use("/users", usersRouter);


app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        return res.status(400).json({ error: "Invalid JSON syntax" });
    }
    next();
});


// cd keys
// openssl req -nodes -new -x509 -keyout server.key -out server.cert
const options = {
    key: fs.readFileSync("./keys/server.key"),
    cert: fs.readFileSync("./keys/server.cert")
}

https.createServer(options, app).listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});

http.createServer((req,res) => {
    // let status = 301
    // if(req.method === 'POST' || req.method === 'PATCH'){
    //     status = 307
    // }

    res.writeHead(301, {location: `https://localhost:${httpPort}${req.url}`}).end()
}).listen(httpPort, () => {
    console.log(`HTTP server is running on port ${httpPort} (redirecting to HTTPS)`);
});
