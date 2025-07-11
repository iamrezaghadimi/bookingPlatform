const winston = require('winston')
require('winston-mongodb')
const { format } = winston
const { combine, timestamp, colorize, printf} = format


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
            db: require('../utils/databasePath')(),
            collection: 'error_logs'
        })
    ],
    exceptionHandlers: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/exceptions.log'})
    ]
})

module.exports = logger;