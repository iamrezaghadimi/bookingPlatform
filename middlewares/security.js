const helmet = require('helmet')
const session = require('express-session')
const MongoStore = require('connect-mongo');

const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

module.exports = (app) => {
    app.use(helmet())
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
}