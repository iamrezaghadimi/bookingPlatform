const winston = require('winston')
require('winston-mongodb')
const { format } = winston
const { combine, timestamp, colorize, printf} = format

const MONGODB_URI = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}?authSource=admin`;

const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  const log = `${timestamp} [${level}]: ${message}`;
  return stack ? `${log}\n${stack}` : log;
});


const logger = winston.createLogger({
    format: combine(
        colorize(),
        timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        consoleFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.MongoDB({
            db: MONGODB_URI,
            collection: 'error_logs'
        })
    ],
    exceptionHandlers: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/exceptions.log'})
    ]
})

module.exports = logger;