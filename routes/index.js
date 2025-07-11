const express = require("express");
const rateLimit = require('express-rate-limit')
const flightsRouter = require("./flights");
const hotelsRouter = require("./hotels");
const usersRouter = require("./users");

const loginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,
    message: {error: "Too many login attempts. Try again later..."}
})


module.exports = (app) => {
    app.use("/users/signin", loginLimiter)
    app.use(express.json());  
    app.use(express.urlencoded({ extended: true })); 
    app.use("/flights", flightsRouter);
    app.use("/hotels", hotelsRouter);
    app.use("/users", usersRouter);
}