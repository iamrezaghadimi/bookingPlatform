const  {AppError, ValidationError} = require('../utils/errors')
const logger = require('../utils/logger')

module.exports = (app) => {
    app.use((err, req, res, next) => {
        logger.error('Exception', err)

            if(err instanceof ValidationError){
                return res.status(err.statusCode).json({
                    error: {
                        type: err.name,
                        message: err.message,
                        details: err.details.map(detail => ({
                            message: detail.message,
                            path: detail.path,
                            type: detail.type
                        }))
                    }
                })
            }

            if(err instanceof AppError){
                return res.status(err.statusCode).json({
                    error: {
                        type: err.name,
                        message: err.message,
                    }
                })
            }
            
            // logger.error("Exception", err)

            return res.status(500).json({
                error: {
                    type: "InternalServerError",
                    message: "Something has went wrong! That's all we know!",
                    ...(process.env.NODE_ENV === "development" && {
                        message: err.message,
                        stack: err.stack
                    })
                }
            })
    })
}